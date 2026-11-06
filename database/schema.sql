-- ==============================================================================
-- Schema Supabase (PostgreSQL) - Projet E-commerce Accessoires High-Tech
-- ==============================================================================

-- Activation de l'extension pgcrypto pour les UUID
create extension if not exists "pgcrypto";

-- Table des utilisateurs (Clients et Administrateurs)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

-- Table des catégories de produits
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- Table des produits
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Table des commandes
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Table des lignes de commande
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

-- Index pour optimiser les performances des requêtes
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_order_items_order on order_items(order_id);

