-- ==============================================================================
-- Politique RLS (Row Level Security) — TechNova Store
-- À exécuter dans Supabase SQL Editor
-- La Secret key (service role) bypasse toutes ces politiques côté backend.
-- Ces politiques protègent uniquement les accès directs via la clé publique.
-- ==============================================================================

-- ── 1. RÉACTIVER LE RLS SUR TOUTES LES TABLES ──────────────────────────────

ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items  ENABLE ROW LEVEL SECURITY;


-- ── 2. SUPPRIMER LES ANCIENNES POLITIQUES (si elles existent) ───────────────

DROP POLICY IF EXISTS "products_public_read"       ON public.products;
DROP POLICY IF EXISTS "categories_public_read"     ON public.categories;
DROP POLICY IF EXISTS "users_own_read"             ON public.users;
DROP POLICY IF EXISTS "users_own_update"           ON public.users;
DROP POLICY IF EXISTS "orders_own_read"            ON public.orders;
DROP POLICY IF EXISTS "order_items_own_read"       ON public.order_items;


-- ── 3. TABLE : products ─────────────────────────────────────────────────────
-- Lecture publique (catalogue visible par tous)
-- Écriture : uniquement via le backend (service role bypasse le RLS)

CREATE POLICY "products_public_read"
  ON public.products
  FOR SELECT
  USING (true);  -- tout le monde peut lire le catalogue


-- ── 4. TABLE : categories ───────────────────────────────────────────────────
-- Lecture publique

CREATE POLICY "categories_public_read"
  ON public.categories
  FOR SELECT
  USING (true);


-- ── 5. TABLE : users ────────────────────────────────────────────────────────
-- Un utilisateur ne peut lire/modifier que son propre profil
-- (le backend utilise service role donc cette politique ne s'applique pas à lui)

CREATE POLICY "users_own_read"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_own_update"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);


-- ── 6. TABLE : orders ───────────────────────────────────────────────────────
-- Un client ne voit que ses propres commandes

CREATE POLICY "orders_own_read"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);


-- ── 7. TABLE : order_items ──────────────────────────────────────────────────
-- Un client ne voit que les lignes de ses propres commandes

CREATE POLICY "order_items_own_read"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
