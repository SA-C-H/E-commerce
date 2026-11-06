import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import { generateWhatsAppLink } from '../utils/whatsapp.js';

/**
 * Création d'une commande avec vérification de stock et génération du lien WhatsApp
 */
export const createOrder = async (userId, userDefaultName, { customer_name, customer_phone, items }) => {
  const finalCustomerName = customer_name?.trim() || userDefaultName || 'Client';

  // 1. Récupération et vérification de la disponibilité et du stock pour chaque produit
  const productIds = items.map((i) => i.product_id);
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .in('id', productIds);

  if (prodError) {
    throw new AppError(`Erreur lors de la vérification des articles : ${prodError.message}`, 500);
  }

  const productMap = new Map((products || []).map((p) => [p.id, p]));

  let total = 0;
  const enrichedItems = [];

  for (const item of items) {
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
      current_stock: product.stock,
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
    throw new AppError(`Échec lors de l'enregistrement de la commande : ${orderError.message}`, 500);
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
    // Si échec sur les items, on annule ou supprime la commande orpheline
    await supabase.from('orders').delete().eq('id', order.id);
    throw new AppError(`Échec lors de l'enregistrement des articles : ${itemsError.message}`, 500);
  }

  // 4. Décrémentation du stock pour chaque produit commandé
  for (const item of enrichedItems) {
    const updatedStock = item.current_stock - item.quantity;
    await supabase
      .from('products')
      .update({ stock: Math.max(0, updatedStock) })
      .eq('id', item.product_id);
  }

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
 */
export const updateOrderStatus = async (orderId, status) => {
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('id', orderId)
    .maybeSingle();

  if (!existing) {
    throw new AppError('Commande introuvable', 404);
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('*, order_items(*, products(name, image_url))')
    .single();

  if (error) {
    throw new AppError(`Impossible de mettre à jour le statut : ${error.message}`, 500);
  }

  return data;
};

