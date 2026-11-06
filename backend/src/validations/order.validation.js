import { z } from 'zod';

export const createOrderSchema = z.object({
  customer_name: z.string().trim().min(2, 'Le nom du client doit comporter au moins 2 caractères').optional(),
  customer_phone: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid('Identifiant de produit invalide'),
        quantity: z.coerce.number().int().min(1, 'La quantité doit être supérieure ou égale à 1'),
      })
    )
    .min(1, 'La commande doit comporter au moins un article'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Le statut doit être : pending, confirmed, delivered ou cancelled' }),
  }),
});

