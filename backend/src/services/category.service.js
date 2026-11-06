import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

/**
 * Récupère toutes les catégories avec le nombre de produits associés
 */
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('name', { ascending: true });

  if (error) {
    throw new AppError(`Erreur lors de la récupération des catégories : ${error.message}`, 500);
  }

  // Formatage du résultat pour simplifier le retour côté client
  return data.map((cat) => ({
    id: cat.id,
    name: cat.name,
    productCount: cat.products?.[0]?.count || 0,
  }));
};

/**
 * Création d'une catégorie (Admin)
 */
export const createCategory = async ({ name }) => {
  const trimmedName = name.trim();

  // Vérifier les doublons
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', trimmedName)
    .maybeSingle();

  if (existing) {
    throw new AppError('Une catégorie avec ce nom existe déjà', 409);
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: trimmedName }])
    .select()
    .single();

  if (error) {
    throw new AppError(`Impossible de créer la catégorie : ${error.message}`, 500);
  }

  return data;
};

/**
 * Mise à jour d'une catégorie (Admin)
 */
export const updateCategory = async (id, { name }) => {
  const trimmedName = name.trim();

  // Vérifier si la catégorie existe
  const { data: existing, error: checkError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (checkError || !existing) {
    throw new AppError('Catégorie introuvable', 404);
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ name: trimmedName })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new AppError(`Impossible de mettre à jour la catégorie : ${error.message}`, 500);
  }

  return data;
};

/**
 * Suppression d'une catégorie (Admin)
 */
export const deleteCategory = async (id) => {
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    throw new AppError('Catégorie introuvable', 404);
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    throw new AppError(`Impossible de supprimer la catégorie : ${error.message}`, 500);
  }

  return { message: 'Catégorie supprimée avec succès' };
};

