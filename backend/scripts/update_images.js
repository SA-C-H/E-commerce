/**
 * Script de mise à jour automatique des images produits
 * Assigne une image officielle haute qualité à chaque produit selon son nom
 * Usage : node database/update_images.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Règles d'assignation d'images par mot-clé dans le nom du produit.
 * URLs CDN officielles ou Unsplash haute qualité par modèle.
 */
const IMAGE_RULES = [
  // ── APPLE iPhone ──
  { match: /iphone 16 pro max/i, url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 16 pro\b/i,   url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 16 plus/i,    url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 16/i,         url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 15 pro max/i, url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 15 pro\b/i,   url: 'https://images.unsplash.com/photo-1694426247253-1c7cb4960f2a?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 15/i,         url: 'https://images.unsplash.com/photo-1688561808434-886a6dd97b8c?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 14 pro/i,     url: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 14/i,         url: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&auto=format&fit=crop&q=85' },
  { match: /iphone 13/i,         url: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=85' },

  // ── APPLE Mac ──
  { match: /macbook pro 16/i,    url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=85' },
  { match: /macbook pro 14/i,    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=85' },
  { match: /macbook pro/i,       url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=85' },
  { match: /macbook air m3/i,    url: 'https://images.unsplash.com/photo-1611186871525-9e2af0d6e7a6?w=800&auto=format&fit=crop&q=85' },
  { match: /macbook air m2/i,    url: 'https://images.unsplash.com/photo-1611186871525-9e2af0d6e7a6?w=800&auto=format&fit=crop&q=85' },
  { match: /macbook air/i,       url: 'https://images.unsplash.com/photo-1611186871525-9e2af0d6e7a6?w=800&auto=format&fit=crop&q=85' },

  // ── APPLE iPad ──
  { match: /ipad pro 13/i,       url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=85' },
  { match: /ipad pro 11/i,       url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=85' },
  { match: /ipad air/i,          url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=85' },
  { match: /ipad mini/i,         url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=85' },
  { match: /ipad/i,              url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=85' },

  // ── SAMSUNG Galaxy S ──
  { match: /galaxy s24 ultra/i,  url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=85' },
  { match: /galaxy s24\+/i,      url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=85' },
  { match: /galaxy s24/i,        url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=85' },
  { match: /galaxy s23 ultra/i,  url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&auto=format&fit=crop&q=85' },
  { match: /galaxy s23/i,        url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&auto=format&fit=crop&q=85' },

  // ── SAMSUNG Galaxy Z ──
  { match: /galaxy z fold/i,     url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=85' },
  { match: /galaxy z flip/i,     url: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&auto=format&fit=crop&q=85' },

  // ── SAMSUNG Galaxy Tab ──
  { match: /galaxy tab s9 ultra/i, url: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=85' },
  { match: /galaxy tab s9/i,     url: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=85' },
  { match: /galaxy tab/i,        url: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=85' },

  // ── GOOGLE Pixel ──
  { match: /pixel 9 pro/i,       url: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&auto=format&fit=crop&q=85' },
  { match: /pixel 9/i,           url: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&auto=format&fit=crop&q=85' },
  { match: /pixel 8 pro/i,       url: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&auto=format&fit=crop&q=85' },
  { match: /pixel 8/i,           url: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&auto=format&fit=crop&q=85' },
  { match: /pixel/i,             url: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&auto=format&fit=crop&q=85' },

  // ── ASUS ROG / Gaming ──
  { match: /rog strix scar/i,    url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=85' },
  { match: /rog strix/i,         url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=85' },
  { match: /rog zephyrus/i,      url: 'https://images.unsplash.com/photo-1593640408182-31c228a31b93?w=800&auto=format&fit=crop&q=85' },
  { match: /rog flow/i,          url: 'https://images.unsplash.com/photo-1593640408182-31c228a31b93?w=800&auto=format&fit=crop&q=85' },
  { match: /rog/i,               url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=85' },

  // ── DELL ──
  { match: /dell xps 15/i,       url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=85' },
  { match: /dell xps 16/i,       url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=85' },
  { match: /dell xps/i,          url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=85' },
  { match: /dell inspiron/i,     url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=85' },
  { match: /dell/i,              url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=85' },

  // ── RAZER ──
  { match: /razer blade 16/i,    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=85' },
  { match: /razer blade/i,       url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=85' },

  // ── HP ──
  { match: /hp spectre/i,        url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=85' },
  { match: /hp envy/i,           url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=85' },
  { match: /hp omen/i,           url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=85' },

  // ── LENOVO ──
  { match: /lenovo thinkpad/i,   url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=85' },
  { match: /lenovo yoga/i,       url: 'https://images.unsplash.com/photo-1611186871525-9e2af0d6e7a6?w=800&auto=format&fit=crop&q=85' },
  { match: /lenovo legion/i,     url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=85' },

  // ── XIAOMI / ONEPLUS ──
  { match: /xiaomi 14/i,         url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=85' },
  { match: /xiaomi/i,            url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=85' },
  { match: /oneplus/i,           url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=85' },

  // ── Fallbacks génériques ──
  { match: /laptop|portable|notebook/i, url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=85' },
  { match: /phone|smartphone/i,  url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=85' },
  { match: /tablette|tablet/i,   url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=85' },
];

function getImageForProduct(name) {
  for (const rule of IMAGE_RULES) {
    if (rule.match.test(name)) {
      return rule.url;
    }
  }
  return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=85';
}

async function run() {
  console.log('🔍 Chargement de tous les produits...');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url');

  if (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }

  console.log(`📦 ${products.length} produits trouvés\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const newUrl = getImageForProduct(product.name);

    // Ne pas mettre à jour si l'image est déjà correcte
    if (product.image_url === newUrl) {
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: newUrl })
      .eq('id', product.id);

    if (updateError) {
      console.error(`  ❌ ${product.name}: ${updateError.message}`);
    } else {
      console.log(`  ✅ ${product.name.slice(0, 60)}`);
      updated++;
    }
  }

  console.log(`\n✅ ${updated} produits mis à jour`);
  console.log(`⏭  ${skipped} produits déjà à jour`);
  console.log('\n🎉 Images mises à jour avec succès !');
}

run();
