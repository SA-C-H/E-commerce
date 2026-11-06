-- ==============================================================================
-- 01_security_rls.sql : Configuration de la sécurité et politiques RLS
-- ==============================================================================

-- Autoriser la lecture publique des catalogues (produits et catégories)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique categories" ON categories;
CREATE POLICY "Lecture publique categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lecture publique products" ON products;
CREATE POLICY "Lecture publique products" ON products FOR SELECT USING (true);

-- Désactiver RLS sur les tables de commande et d'utilisateurs pour les requêtes backend
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
