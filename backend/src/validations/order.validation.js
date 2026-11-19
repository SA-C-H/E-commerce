import { z } from 'zod';

// Regex téléphone international (Maroc et formats courants)
const phoneRegex = /^(\+?[0-9]{7,15}|0[0-9]{9})$/;

export const createOrderSchema = z.object({
  customer_name: z.string().trim().min(2, 'Le nom du client doit comporter au moins 2 caractères').optional(),
  // A6 — validation format téléphone
  customer_phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Numéro de téléphone invalide (ex: 0612345678 ou +212612345678)')
    .optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid('Identifiant de produit invalide'),
        // A5 — limite max 100 unités par ligne
        quantity: z.coerce
          .number()
          .int()
          .min(1, 'La quantité doit être supérieure ou égale à 1')
          .max(100, 'La quantité ne peut pas dépasser 100 unités par article'),
      })
    )
    .min(1, 'La commande doit comporter au moins un article'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Le statut doit être : pending, confirmed, delivered ou cancelled' }),
  }),
});

