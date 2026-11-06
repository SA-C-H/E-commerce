import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

/**
 * Récupère la liste des produits avec pagination, recherche et filtres
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
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('products')
    .select('*, categories(id, name)', { count: 'exact' });

  // 1. Filtrage par catégorie
  if (category) {
    query = query.eq('category_id', category);
  }

  // 2. Recherche textuelle insensible à la casse
  if (search && search.trim() !== '') {
    const cleanSearch = search.trim();
    query = query.or(`name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`);
  }

  // 3. Filtre par intervalle de prix
  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  // 4. Tri
  if (sortBy === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sortBy === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // 5. Pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw new AppError(`Erreur lors de la récupération des produits : ${error.message}`, 500);
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    products: data || [],
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Récupère le détail d'un produit par son identifiant
 */
export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new AppError(`Erreur lors de la récupération du produit : ${error.message}`, 500);
  }

  if (!data) {
    throw new AppError('Produit introuvable', 404);
  }

  return data;
};

/**
 * Création d'un produit (Admin)
 */
export const createProduct = async (productData) => {
  // Si une catégorie est spécifiée, vérifier qu'elle existe
  if (productData.category_id) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', productData.category_id)
      .maybeSingle();

    if (!category) {
      throw new AppError('La catégorie spécifiée n\'existe pas', 400);
    }
  }

  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select('*, categories(id, name)')
    .single();

  if (error) {
    throw new AppError(`Impossible de créer le produit : ${error.message}`, 500);
  }

  return data;
};

/**
 * Modification d'un produit (Admin)
 */
export const updateProduct = async (id, updateData) => {
  // Vérifier si le produit existe
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    throw new AppError('Produit introuvable', 404);
  }

  if (updateData.category_id) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', updateData.category_id)
      .maybeSingle();

    if (!category) {
      throw new AppError('La catégorie spécifiée n\'existe pas', 400);
    }
  }

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select('*, categories(id, name)')
    .single();

  if (error) {
    throw new AppError(`Impossible de mettre à jour le produit : ${error.message}`, 500);
  }

  return data;
};

/**
 * Suppression d'un produit (Admin)
 */
export const deleteProduct = async (id) => {
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    throw new AppError('Produit introuvable', 404);
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new AppError(`Impossible de supprimer le produit : ${error.message}`, 500);
  }

  return { message: 'Produit supprimé avec succès' };
};

