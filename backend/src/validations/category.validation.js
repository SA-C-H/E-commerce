import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Le nom de la catégorie est obligatoire' })
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
});

export const updateCategorySchema = createCategorySchema;

