-- ==============================================================================
-- update_images.sql
-- Met à jour les image_url de tous les produits avec des photos Unsplash
-- uniques et pertinentes par modèle/catégorie.
-- À exécuter dans l'éditeur SQL de Supabase.
-- ==============================================================================

-- -----------------------------------------------------------------------
-- APPLE IPHONE
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 16 Pro Max%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1695048065050-8b172088f11b?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 16 Pro%' AND name NOT ILIKE '%Pro Max%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 16 Plus%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 16%' AND name NOT ILIKE '%Pro%' AND name NOT ILIKE '%Plus%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 15 Pro Max%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1664478546386-d57ffe74a78d?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 15 Pro%' AND name NOT ILIKE '%Pro Max%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 15 Plus%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 15%' AND name NOT ILIKE '%Pro%' AND name NOT ILIKE '%Plus%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 14 Pro Max%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1632661674596-df8be070a5c6?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 14 Pro%' AND name NOT ILIKE '%Pro Max%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1574755393849-623942496936?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 14%' AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone 13%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1529653762956-b0a27278529c?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPhone SE%';

-- -----------------------------------------------------------------------
-- SAMSUNG GALAXY
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy S24 Ultra%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy S24+%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy S24%' AND name NOT ILIKE '%Ultra%' AND name NOT ILIKE '%+%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy Z Fold%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1636114959891-69f61db15e02?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy Z Flip%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy S23%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1543721078-8302a9d9bd39?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy A%';

-- -----------------------------------------------------------------------
-- GOOGLE PIXEL
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Pixel 9 Pro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Pixel 9%' AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Pixel 8%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1543721078-8302a9d9bd39?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Pixel 7%';

-- -----------------------------------------------------------------------
-- XIAOMI / ONEPLUS / AUTRES ANDROID
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Xiaomi 14%' OR name ILIKE '%Xiaomi 13%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1543721078-8302a9d9bd39?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Redmi%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%OnePlus%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%POCO%' OR name ILIKE '%Poco%';

-- -----------------------------------------------------------------------
-- APPLE MACBOOK
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%MacBook Pro 16%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%MacBook Pro 14%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%MacBook Pro 13%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%MacBook Air%' AND (name ILIKE '%M3%' OR name ILIKE '%M2%');

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%MacBook Air%' AND name ILIKE '%M1%';

-- -----------------------------------------------------------------------
-- LAPTOPS PROFESSIONNELS (Dell, HP, Lenovo ThinkPad)
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Dell XPS%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%ThinkPad%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%HP EliteBook%' OR name ILIKE '%HP ProBook%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Surface Laptop%' OR name ILIKE '%Surface Pro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Lenovo IdeaPad%' OR name ILIKE '%Lenovo Yoga%';

-- -----------------------------------------------------------------------
-- LAPTOPS GAMING (Asus ROG, Razer, MSI, Acer Predator)
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%ASUS ROG%' OR name ILIKE '%Asus ROG%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Razer Blade%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%MSI%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1619455258070-98e5c08fdb87?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Predator%' OR name ILIKE '%Acer Nitro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%TUF Gaming%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Legion%';

-- -----------------------------------------------------------------------
-- TABLETTES (iPad, Samsung Tab)
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPad Pro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPad Air%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPad mini%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%iPad%' AND name NOT ILIKE '%Pro%' AND name NOT ILIKE '%Air%' AND name NOT ILIKE '%mini%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Galaxy Tab%';
