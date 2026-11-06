import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Le nom du produit est obligatoire' })
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères'),
  description: z.string().optional().default(''),
  price: z.coerce
    .number({ required_error: 'Le prix est obligatoire' })
    .min(0, 'Le prix doit être supérieur ou égal à 0'),
  stock: z.coerce
    .number({ required_error: 'Le stock est obligatoire' })
    .int('Le stock doit être un nombre entier')
    .min(0, 'Le stock doit être positif ou nul'),
  image_url: z.string().optional().nullable(),
  category_id: z.string().uuid('Identifiant de catégorie invalide').optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export const queryProductSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(12),
  category: z.string().uuid().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'newest']).default('newest'),
});

