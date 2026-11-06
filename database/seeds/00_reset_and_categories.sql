-- ==============================================================================
-- 00_reset_and_categories.sql : Initialisation des Catégories
-- ==============================================================================

-- Optionnel : vider les anciennes données si vous souhaitez repartir à zéro
-- delete from order_items;
-- delete from orders;
-- delete from products;
-- delete from categories;

INSERT INTO categories (name) VALUES
  ('Apple iPhone'),
  ('Samsung Galaxy'),
  ('Google Pixel'),
  ('Xiaomi & OnePlus'),
  ('Apple MacBook'),
  ('Laptops Professionnels (Dell, Lenovo, HP)'),
  ('Laptops Gaming (Asus ROG, MSI, Razer)'),
  ('Tablettes & iPads')
ON CONFLICT (name) DO NOTHING;
