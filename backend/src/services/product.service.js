import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import { cached, invalidate } from '../utils/cache.js';

/**
 * Récupère la liste des produits avec pagination, recherche et filtres
 * Cache TTL : 60s pour les listes, 2min pour les détails
 */
export const getAllProducts = async ({
  page = 1,
  limit = 12,
  category,
  search,
  minPrice,
  maxPrice,
  sortBy = 'newest',
}) => {
  const cacheKey = `products:list:${page}:${limit}:${category || ''}:${search || ''}:${minPrice || ''}:${maxPrice || ''}:${sortBy}`;

  return cached(cacheKey, async () => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select('*, categories(id, name)', { count: 'exact' });

    if (category) query = query.eq('category_id', category);
    if (search && search.trim() !== '') {
      // B7 — Nettoyer la saisie : limiter la longueur et échapper les caractères spéciaux PostgREST
      const rawSearch = search.trim().slice(0, 100);
      // Échapper % et _ pour éviter des patterns ILIKE involontaires, et les virgules/parenthèses
      // qui permettraient d'injecter des filtres supplémentaires dans le paramètre .or()
      const cleanSearch = rawSearch.replace(/[%_(),]/g, '\\$&');
      query = query.or(`name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`);
    }
    if (minPrice !== undefined) query = query.gte('price', minPrice);
    if (maxPrice !== undefined) query = query.lte('price', maxPrice);

    if (sortBy === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw new AppError(`Erreur lors de la récupération des produits`, 500);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products: data || [],
      pagination: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
    };
  }, 60_000); // 60 secondes
};

/**
 * Récupère le détail d'un produit par son identifiant
 * Cache TTL : 2 minutes
 */
export const getProductById = async (id) => {
  return cached(`products:detail:${id}`, async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new AppError(`Erreur lors de la récupération du produit`, 500);
    if (!data) throw new AppError('Produit introuvable', 404);

    return data;
  }, 2 * 60_000);
};

/**
 * Création d'un produit (Admin)
 */
export const createProduct = async (productData) => {
  if (productData.category_id) {
    const { data: category } = await supabase
      .from('categories').select('id').eq('id', productData.category_id).maybeSingle();
    if (!category) throw new AppError('La catégorie spécifiée n\'existe pas', 400);
  }

  const { data, error } = await supabase
    .from('products').insert([productData]).select('*, categories(id, name)').single();

  if (error) throw new AppError(`Impossible de créer le produit`, 500);

  invalidate('products:*', 'categories:all');
  return data;
};

/**
 * Modification d'un produit (Admin)
 */
export const updateProduct = async (id, updateData) => {
  const { data: existing } = await supabase.from('products').select('id').eq('id', id).maybeSingle();
  if (!existing) throw new AppError('Produit introuvable', 404);

  if (updateData.category_id) {
    const { data: category } = await supabase
      .from('categories').select('id').eq('id', updateData.category_id).maybeSingle();
    if (!category) throw new AppError('La catégorie spécifiée n\'existe pas', 400);
  }

  const { data, error } = await supabase
    .from('products').update(updateData).eq('id', id).select('*, categories(id, name)').single();

  if (error) throw new AppError(`Impossible de mettre à jour le produit`, 500);

  invalidate('products:*', 'categories:all');
  return data;
};

/**
 * D1 — Ajustement atomique du stock (+/- delta) pour l'admin
 *       Utilise stock = stock + delta au lieu d'un stock absolu
 *       pour éviter d'écraser une valeur mise à jour entre-temps.
 */
export const adjustStock = async (id, delta) => {
  const { data: existing } = await supabase.from('products').select('id, stock').eq('id', id).maybeSingle();
  if (!existing) throw new AppError('Produit introuvable', 404);

  const { data, error } = await supabase.rpc('increment_stock', {
    p_product_id: id,
    p_quantity: delta,
  });

  if (error) throw new AppError('Erreur lors de l\'ajustement du stock', 500);

  // Récupérer le produit mis à jour
  const { data: updated } = await supabase
    .from('products')
    .select('*, categories(id, name)')
    .eq('id', id)
    .single();

  invalidate('products:*');
  return updated;
};

/**
 * Suppression d'un produit (Admin)
 */
export const deleteProduct = async (id) => {
  const { data: existing } = await supabase.from('products').select('id').eq('id', id).maybeSingle();
  if (!existing) throw new AppError('Produit introuvable', 404);

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new AppError(`Impossible de supprimer le produit`, 500);

  invalidate('products:*', 'categories:all');
  return { message: 'Produit supprimé avec succès' };
};

