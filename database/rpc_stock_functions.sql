-- ============================================================
-- Fonctions RPC pour la gestion atomique du stock
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================================

-- Décrémentation atomique du stock
-- Retourne une erreur si le stock est insuffisant (évite la survente)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products
  SET stock = stock - p_quantity
  WHERE id = p_product_id
    AND stock >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stock insuffisant pour le produit %', p_product_id
      USING ERRCODE = 'P0001';
  END IF;
END;
$$;

-- Incrémentation du stock (remise en stock sur annulation)
CREATE OR REPLACE FUNCTION increment_stock(p_product_id UUID, p_quantity INT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products
  SET stock = stock + p_quantity
  WHERE id = p_product_id;
END;
$$;
