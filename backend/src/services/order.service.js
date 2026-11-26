import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import { generateWhatsAppLink } from '../utils/whatsapp.js';
import { invalidate } from '../utils/cache.js';

/**
 * Création d'une commande avec vérification de stock et génération du lien WhatsApp
 */
export const createOrder = async (userId, userDefaultName, { customer_name, customer_phone, items }) => {
  const finalCustomerName = customer_name?.trim() || userDefaultName || 'Client';

  // A1 — Fusionner les doublons : additionner les quantités pour un même product_id
  const mergedMap = new Map();
  for (const item of items) {
    const existing = mergedMap.get(item.product_id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      mergedMap.set(item.product_id, { ...item });
    }
  }
  const mergedItems = Array.from(mergedMap.values());

  // 1. Récupération et vérification de la disponibilité et du stock pour chaque produit
  const productIds = mergedItems.map((i) => i.product_id);
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .in('id', productIds);

  if (prodError) {
    throw new AppError('Erreur lors de la vérification des articles', 500);
  }

  const productMap = new Map((products || []).map((p) => [p.id, p]));

  let total = 0;
  const enrichedItems = [];

  for (const item of mergedItems) {
    const product = productMap.get(item.product_id);

    if (!product) {
      throw new AppError(`Le produit associé à l'identifiant ${item.product_id} n'existe pas`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Stock insuffisant pour "${product.name}". Disponible : ${product.stock}, demandé : ${item.quantity}`,
        409
      );
    }

    const unitPrice = Number(product.price);
    total += unitPrice * item.quantity;

    enrichedItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: unitPrice,
    });
  }

  // 2. Création de la commande dans la table `orders`
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        customer_name: finalCustomerName,
        customer_phone: customer_phone?.trim() || null,
        total: Number(total.toFixed(2)),
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (orderError) {
    throw new AppError('Échec lors de l\'enregistrement de la commande', 500);
  }

  // 3. Insertion des articles dans `order_items`
  const orderItemsData = enrichedItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);

  if (itemsError) {
    // Si échec sur les items, on supprime la commande orpheline
    await supabase.from('orders').delete().eq('id', order.id);
    throw new AppError('Échec lors de l\'enregistrement des articles', 500);
  }

  // A2 — Décrémentation atomique : UPDATE stock = stock - qty WHERE stock >= qty
  //       Si aucune ligne n'est mise à jour → stock insuffisant au moment de l'écriture (race condition)
  for (const item of enrichedItems) {
    const currentStock = productMap.get(item.product_id).stock;

    const { error: decrementError } = await supabase
      .from('products')
      .update({ stock: currentStock - item.quantity })
      .eq('id', item.product_id)
      .gte('stock', item.quantity); // garde atomique anti-survente

    if (decrementError) {
      // Rollback : remettre les stocks des articles déjà décrémentés
      for (const done of enrichedItems.slice(0, enrichedItems.indexOf(item))) {
        const prev = productMap.get(done.product_id);
        await supabase
          .from('products')
          .update({ stock: prev.stock })
          .eq('id', done.product_id);
      }
      await supabase.from('order_items').delete().eq('order_id', order.id);
      await supabase.from('orders').delete().eq('id', order.id);
      throw new AppError(
        `Erreur lors de la réservation du stock pour "${item.product_name}"`,
        409
      );
    }
  }

  // A3 — Invalider le cache produits pour que le stock soit à jour immédiatement
  invalidate('products:*');

  // 5. Génération du lien WhatsApp récapitulatif
  const whatsappUrl = generateWhatsAppLink(order, enrichedItems, finalCustomerName);

  return {
    order,
    items: enrichedItems,
    whatsappUrl,
  };
};

/**
 * Récupération des commandes (Admin : toutes, Client : les siennes)
 */
export const getOrders = async (user) => {
  let query = supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url, price))')
    .order('created_at', { ascending: false });

  // Si ce n'est pas un admin, on filtre par son propre user_id
  if (user.role !== 'admin') {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new AppError(`Erreur lors de la récupération des commandes : ${error.message}`, 500);
  }

  return data || [];
};

/**
 * Détail d'une commande par identifiant
 */
export const getOrderById = async (orderId, user) => {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url, price))')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    throw new AppError(`Erreur lors de la récupération de la commande : ${error.message}`, 500);
  }

  if (!order) {
    throw new AppError('Commande introuvable', 404);
  }

  // Vérification des droits : l'admin voit tout, le client ne voit que ses commandes
  if (user.role !== 'admin' && order.user_id !== user.id) {
    throw new AppError('Accès interdit à cette commande', 403);
  }

  return order;
};

/**
 * Changement du statut d'une commande (Admin)
 * A4 — remise en stock sur annulation, transitions valides uniquement
 */
export const updateOrderStatus = async (orderId, status) => {
  // Transitions autorisées : on ne peut pas revenir en arrière une fois livré
  const allowedTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['delivered', 'cancelled'],
    delivered: [],       // statut terminal
    cancelled: [],       // statut terminal
  };

  const { data: existing } = await supabase
    .from('orders')
    .select('id, status, order_items(product_id, quantity)')
    .eq('id', orderId)
    .maybeSingle();

  if (!existing) {
    throw new AppError('Commande introuvable', 404);
  }

  const allowed = allowedTransitions[existing.status] || [];
  if (!allowed.includes(status)) {
    throw new AppError(
      `Transition invalide : impossible de passer de "${existing.status}" à "${status}"`,
      400
    );
  }

  // A4 — Si on annule, remettre le stock en base
  if (status === 'cancelled' && existing.order_items?.length) {
    for (const item of existing.order_items) {
      // Récupérer le stock actuel puis incrémenter
      const { data: prod } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .maybeSingle();

      if (prod) {
        await supabase
          .from('products')
          .update({ stock: prod.stock + item.quantity })
          .eq('id', item.product_id);
      }
    }
    invalidate('products:*');
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('*, order_items(*, products(name, image_url))')
    .single();

  if (error) {
    throw new AppError('Impossible de mettre à jour le statut', 500);
  }

  return data;
};

