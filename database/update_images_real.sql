-- ==============================================================================
-- update_images_real.sql
-- URLs d'images officielles des fabricants (Apple, Samsung, Google, etc.)
-- via le CDN GSMArena (fdn2.gsmarena.com) — photos produits officielles.
-- À exécuter dans l'éditeur SQL de Supabase.
-- ==============================================================================

-- -----------------------------------------------------------------------
-- APPLE IPHONE 16
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg'
WHERE name ILIKE '%iPhone 16 Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-1.jpg'
WHERE name ILIKE '%iPhone 16 Pro%' AND name NOT ILIKE '%Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-plus-1.jpg'
WHERE name ILIKE '%iPhone 16 Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-1.jpg'
WHERE name ILIKE '%iPhone 16%'
  AND name NOT ILIKE '%Pro%'
  AND name NOT ILIKE '%Plus%';

-- -----------------------------------------------------------------------
-- APPLE IPHONE 15
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg'
WHERE name ILIKE '%iPhone 15 Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg'
WHERE name ILIKE '%iPhone 15 Pro%' AND name NOT ILIKE '%Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-plus-1.jpg'
WHERE name ILIKE '%iPhone 15 Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg'
WHERE name ILIKE '%iPhone 15%'
  AND name NOT ILIKE '%Pro%'
  AND name NOT ILIKE '%Plus%';

-- -----------------------------------------------------------------------
-- APPLE IPHONE 14
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg'
WHERE name ILIKE '%iPhone 14 Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-1.jpg'
WHERE name ILIKE '%iPhone 14 Pro%' AND name NOT ILIKE '%Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-plus-1.jpg'
WHERE name ILIKE '%iPhone 14 Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg'
WHERE name ILIKE '%iPhone 14%'
  AND name NOT ILIKE '%Pro%'
  AND name NOT ILIKE '%Plus%';

-- -----------------------------------------------------------------------
-- APPLE IPHONE 13
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-pro-max-1.jpg'
WHERE name ILIKE '%iPhone 13 Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-pro-1.jpg'
WHERE name ILIKE '%iPhone 13 Pro%' AND name NOT ILIKE '%Pro Max%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-mini-1.jpg'
WHERE name ILIKE '%iPhone 13 mini%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-1.jpg'
WHERE name ILIKE '%iPhone 13%'
  AND name NOT ILIKE '%Pro%'
  AND name NOT ILIKE '%mini%';

-- -----------------------------------------------------------------------
-- APPLE IPHONE SE
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-se-2022-1.jpg'
WHERE name ILIKE '%iPhone SE%';

-- -----------------------------------------------------------------------
-- SAMSUNG GALAXY S24
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg'
WHERE name ILIKE '%Galaxy S24 Ultra%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24plus-1.jpg'
WHERE name ILIKE '%Galaxy S24+%' OR name ILIKE '%Galaxy S24 Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg'
WHERE name ILIKE '%Galaxy S24%'
  AND name NOT ILIKE '%Ultra%'
  AND name NOT ILIKE '%+%'
  AND name NOT ILIKE '%Plus%';

-- -----------------------------------------------------------------------
-- SAMSUNG GALAXY Z
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-1.jpg'
WHERE name ILIKE '%Galaxy Z Fold 6%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold5-1.jpg'
WHERE name ILIKE '%Galaxy Z Fold 5%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip6-1.jpg'
WHERE name ILIKE '%Galaxy Z Flip 6%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip5-1.jpg'
WHERE name ILIKE '%Galaxy Z Flip 5%';

-- -----------------------------------------------------------------------
-- SAMSUNG GALAXY S23
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-1.jpg'
WHERE name ILIKE '%Galaxy S23 Ultra%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23plus-1.jpg'
WHERE name ILIKE '%Galaxy S23+%' OR name ILIKE '%Galaxy S23 Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-1.jpg'
WHERE name ILIKE '%Galaxy S23%'
  AND name NOT ILIKE '%Ultra%'
  AND name NOT ILIKE '%+%'
  AND name NOT ILIKE '%Plus%';

-- -----------------------------------------------------------------------
-- SAMSUNG GALAXY A
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-1.jpg'
WHERE name ILIKE '%Galaxy A55%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a35-1.jpg'
WHERE name ILIKE '%Galaxy A35%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a54-1.jpg'
WHERE name ILIKE '%Galaxy A54%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a34-1.jpg'
WHERE name ILIKE '%Galaxy A34%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a15-1.jpg'
WHERE name ILIKE '%Galaxy A15%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a05s-1.jpg'
WHERE name ILIKE '%Galaxy A05%';

-- -----------------------------------------------------------------------
-- GOOGLE PIXEL
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg'
WHERE name ILIKE '%Pixel 9 Pro XL%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg'
WHERE name ILIKE '%Pixel 9 Pro Fold%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg'
WHERE name ILIKE '%Pixel 9 Pro%'
  AND name NOT ILIKE '%XL%'
  AND name NOT ILIKE '%Fold%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg'
WHERE name ILIKE '%Pixel 9%' AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg'
WHERE name ILIKE '%Pixel 8 Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg'
WHERE name ILIKE '%Pixel 8%' AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7-pro-1.jpg'
WHERE name ILIKE '%Pixel 7 Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7a-1.jpg'
WHERE name ILIKE '%Pixel 7a%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7-1.jpg'
WHERE name ILIKE '%Pixel 7%'
  AND name NOT ILIKE '%Pro%'
  AND name NOT ILIKE '%7a%';

-- -----------------------------------------------------------------------
-- XIAOMI
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg'
WHERE name ILIKE '%Xiaomi 14 Ultra%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-pro-1.jpg'
WHERE name ILIKE '%Xiaomi 14 Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-1.jpg'
WHERE name ILIKE '%Xiaomi 14%'
  AND name NOT ILIKE '%Ultra%'
  AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13-ultra-1.jpg'
WHERE name ILIKE '%Xiaomi 13 Ultra%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13-pro-1.jpg'
WHERE name ILIKE '%Xiaomi 13 Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13-1.jpg'
WHERE name ILIKE '%Xiaomi 13%'
  AND name NOT ILIKE '%Ultra%'
  AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-plus-1.jpg'
WHERE name ILIKE '%Redmi Note 13 Pro+%' OR name ILIKE '%Redmi Note 13 Pro Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-1.jpg'
WHERE name ILIKE '%Redmi Note 13 Pro%'
  AND name NOT ILIKE '%+%'
  AND name NOT ILIKE '%Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-1.jpg'
WHERE name ILIKE '%Redmi Note 13%'
  AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-pro-1.jpg'
WHERE name ILIKE '%POCO X6 Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-1.jpg'
WHERE name ILIKE '%POCO X6%' AND name NOT ILIKE '%Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f6-pro-1.jpg'
WHERE name ILIKE '%POCO F6 Pro%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f6-1.jpg'
WHERE name ILIKE '%POCO F6%' AND name NOT ILIKE '%Pro%';

-- -----------------------------------------------------------------------
-- ONEPLUS
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg'
WHERE name ILIKE '%OnePlus 12%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12r-1.jpg'
WHERE name ILIKE '%OnePlus 12R%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-ce4-1.jpg'
WHERE name ILIKE '%OnePlus Nord CE 4%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-4-1.jpg'
WHERE name ILIKE '%OnePlus Nord 4%';

-- -----------------------------------------------------------------------
-- APPLE MACBOOK PRO
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-pro-16-2023-1.jpg'
WHERE name ILIKE '%MacBook Pro 16%' AND (name ILIKE '%M3%' OR name ILIKE '%M2%');

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-pro-16-2023-1.jpg'
WHERE name ILIKE '%MacBook Pro 16%' AND name NOT ILIKE '%M3%' AND name NOT ILIKE '%M2%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-pro-14-2023-1.jpg'
WHERE name ILIKE '%MacBook Pro 14%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-pro-13-m2-2022-1.jpg'
WHERE name ILIKE '%MacBook Pro 13%';

-- -----------------------------------------------------------------------
-- APPLE MACBOOK AIR
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-air-15-m3-2024-1.jpg'
WHERE name ILIKE '%MacBook Air 15%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-air-13-m3-2024-1.jpg'
WHERE name ILIKE '%MacBook Air%' AND (name ILIKE '%M3%' OR name ILIKE '%M2%');

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-air-13-m1-2020-1.jpg'
WHERE name ILIKE '%MacBook Air%' AND name ILIKE '%M1%';

-- -----------------------------------------------------------------------
-- LAPTOPS PROFESSIONNELS
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/dell/dell-xps-15-9530-2023-1.jpg'
WHERE name ILIKE '%Dell XPS 15%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/dell/dell-xps-13-9315-1.jpg'
WHERE name ILIKE '%Dell XPS 13%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%ThinkPad X1 Carbon%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%ThinkPad%' AND name NOT ILIKE '%X1 Carbon%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%HP EliteBook%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%HP ProBook%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Surface Laptop%' OR name ILIKE '%Surface Pro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Lenovo Yoga%' OR name ILIKE '%Lenovo IdeaPad%';

-- -----------------------------------------------------------------------
-- LAPTOPS GAMING
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/asus/asus-rog-phone-8-pro-1.jpg'
WHERE name ILIKE '%ASUS ROG%' OR name ILIKE '%Asus ROG%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%TUF Gaming%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Razer Blade%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%MSI%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1619455258070-98e5c08fdb87?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Predator%' OR name ILIKE '%Acer Nitro%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%Legion%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%HP Omen%';

-- -----------------------------------------------------------------------
-- TABLETTES
-- -----------------------------------------------------------------------
UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-pro-m4-13-2024-1.jpg'
WHERE name ILIKE '%iPad Pro%' AND (name ILIKE '%13%' OR name ILIKE '%12.9%');

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-pro-m4-11-2024-1.jpg'
WHERE name ILIKE '%iPad Pro%' AND (name ILIKE '%11%' OR name ILIKE '%11"%');

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-pro-m4-11-2024-1.jpg'
WHERE name ILIKE '%iPad Pro%'
  AND name NOT ILIKE '%13%'
  AND name NOT ILIKE '%12.9%'
  AND name NOT ILIKE '%11%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-air-m2-2024-1.jpg'
WHERE name ILIKE '%iPad Air%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-mini-7-2024-1.jpg'
WHERE name ILIKE '%iPad mini%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-10gen-2022-1.jpg'
WHERE name ILIKE '%iPad%'
  AND name NOT ILIKE '%Pro%'
  AND name NOT ILIKE '%Air%'
  AND name NOT ILIKE '%mini%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-s9-ultra-1.jpg'
WHERE name ILIKE '%Galaxy Tab S9 Ultra%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-s9-plus-1.jpg'
WHERE name ILIKE '%Galaxy Tab S9+%' OR name ILIKE '%Galaxy Tab S9 Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-s9-1.jpg'
WHERE name ILIKE '%Galaxy Tab S9%'
  AND name NOT ILIKE '%Ultra%'
  AND name NOT ILIKE '%+%'
  AND name NOT ILIKE '%Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-a9-plus-1.jpg'
WHERE name ILIKE '%Galaxy Tab A9+%' OR name ILIKE '%Galaxy Tab A9 Plus%';

UPDATE products SET image_url = 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-a9-1.jpg'
WHERE name ILIKE '%Galaxy Tab A9%'
  AND name NOT ILIKE '%+%'
  AND name NOT ILIKE '%Plus%';
