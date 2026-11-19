// backend/scripts/scrape_images.js

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import { imageSize } from 'image-size';
import dotenv from 'dotenv';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, BING_API_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant dans backend/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---------- Config ----------
const DELAY_MS      = 1500;
const TIMEOUT_MS    = 8000;
const MAX_ATTEMPTS  = 2;
const MIN_LONG_SIDE = 400;
const MIN_SHORT_SIDE = 200;
const MAX_BYTES     = 10 * 1024 * 1024;
const RESULTS_FILE  = path.resolve(__dirname, 'results.json');

const args     = process.argv.slice(2);
const DRY_RUN  = args.includes('--dry-run');
const FORCE    = args.includes('--force');
const LIMIT    = Number(args.find((a) => a.startsWith('--limit='))?.split('=')[1]) || Infinity;

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm  = (s)  => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// ---------- fetch poli ----------
let lastRequestAt = 0;

async function politeFetch(url, opts = {}) {
  const wait = lastRequestAt + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
  return fetch(url, {
    redirect: 'follow',
    ...opts,
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      ...opts.headers,
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

// ---------- Nettoyage du nom ----------
function cleanName(name) {
  return name
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+-\s+.*$/, ' ')
    .replace(/\b5G\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function kindOf(name) {
  if (/(ipad|\btab\b|galaxy tab|macbook|thinkpad|xps|strix|scar|blade|spectre|zenbook|vivobook|legion|predator|alienware|laptop|notebook|elitebook|latitude|ideapad|yoga|surface)/i.test(name))
    return 'laptop_tablet';
  if (/(iphone|galaxy [szam]\d|galaxy z|pixel|xiaomi|redmi|poco|oneplus|oppo|realme|honor|huawei|nothing phone|motorola|moto |vivo|xperia|rog phone)/i.test(name))
    return 'phone';
  return 'other';
}

// ---------- Sources ----------
async function fromGsmarena(name) {
  const base = 'https://www.gsmarena.com/';
  const res = await politeFetch(`${base}results.php3?sQuickSearch=yes&sName=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`GSMArena HTTP ${res.status}`);
  const $ = cheerio.load(await res.text());
  const links = $('.makers ul li a').toArray().map((a) => {
    const span = $(a).find('strong span');
    span.find('br').replaceWith(' ');
    return { href: $(a).attr('href'), title: span.text().trim() };
  });
  if (!links.length) return [];
  const hit = links.find((l) => norm(l.title) === norm(name)) ?? links[0];
  const specUrl = new URL(hit.href, base).href;
  const urls = [];

  const picturesUrl = specUrl.replace(/-(\d+)\.php$/, '-pictures-$1.php');
  const pRes = await politeFetch(picturesUrl);
  if (pRes.ok) {
    const $p = cheerio.load(await pRes.text());
    const img = $p('#pictures-list img, #photos-thumbnails a:first-child img').first();
    const src = img.attr('src') || img.attr('data-src');
    if (src) urls.push(new URL(src, base).href);
  }

  const sRes = await politeFetch(specUrl);
  if (sRes.ok) {
    const $s = cheerio.load(await sRes.text());
    const src = $s('.specs-photo-main img').first().attr('src');
    if (src) urls.push(new URL(src, base).href);
  }

  return urls;
}

async function fromRtings(name) {
  const base = 'https://www.rtings.com';
  const res = await politeFetch(`${base}/search?query=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`RTINGS HTTP ${res.status}`);
  const $ = cheerio.load(await res.text());
  const img = $('a[href*="/reviews/"] img').first();
  const src = img.attr('src') || img.attr('data-src');
  return src ? [new URL(src, base).href] : [];
}

async function fromBing(name) {
  if (!BING_API_KEY) return [];
  const q = encodeURIComponent(`${name} official product image`);
  const res = await politeFetch(
    `https://api.bing.microsoft.com/v7.0/images/search?q=${q}&count=3&imageType=Photo&size=Large`,
    { headers: { 'Ocp-Apim-Subscription-Key': BING_API_KEY } }
  );
  if (!res.ok) throw new Error(`Bing API HTTP ${res.status}`);
  const json = await res.json();
  return (json.value ?? []).map((v) => v.contentUrl).filter(Boolean);
}

async function ddgSearch(query) {
  const home = await politeFetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`);
  const vqd = (await home.text()).match(/vqd=["']?([\d-]+)/)?.[1];
  if (!vqd) throw new Error('DDG: vqd introuvable');
  const res = await politeFetch(
    `https://duckduckgo.com/i.js?l=fr-fr&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`,
    { headers: { Referer: 'https://duckduckgo.com/' } }
  );
  if (!res.ok) throw new Error(`DDG HTTP ${res.status}`);
  return ((await res.json()).results ?? []).map((r) => r.image).filter(Boolean);
}

async function fromDuckDuckGo(name) {
  const urls = await ddgSearch(`${name} site:gsmarena.com OR site:apple.com OR site:samsung.com`);
  if (urls.length) return urls;
  return ddgSearch(`${name} official product image`);
}

const SRC = {
  gsmarena : { id: 'gsmarena', label: 'GSMArena',    fn: fromGsmarena  },
  rtings   : { id: 'rtings',   label: 'RTINGS',      fn: fromRtings    },
  bing     : { id: 'bing',     label: 'Bing',         fn: fromBing      },
  ddg      : { id: 'ddg',      label: 'DuckDuckGo',  fn: fromDuckDuckGo },
};

const ORDER = {
  phone         : [SRC.gsmarena, SRC.bing, SRC.ddg],
  laptop_tablet : [SRC.rtings,   SRC.bing, SRC.ddg],
  other         : [SRC.bing,     SRC.ddg],
};

// ---------- Validation ----------
async function validateImage(url) {
  if (!/^https:\/\//i.test(url)) return null;
  const res = await politeFetch(url);
  if (!res.ok) return null;
  const type = res.headers.get('content-type') ?? '';
  if (!type.startsWith('image/') || type.includes('svg')) return null;
  if (Number(res.headers.get('content-length') ?? 0) > MAX_BYTES) return null;
  const buf = new Uint8Array(await res.arrayBuffer());
  try {
    const { width, height } = imageSize(buf);
    if (Math.max(width, height) < MIN_LONG_SIDE || Math.min(width, height) < MIN_SHORT_SIDE) return null;
    return { width, height };
  } catch {
    return { width: null, height: null };
  }
}

// ---------- Recherche ----------
async function findImage(cleaned, kind) {
  let hadError = false;
  for (const source of ORDER[kind]) {
    let candidates = [];
    try {
      candidates = [...new Set(await source.fn(cleaned))].slice(0, 5);
    } catch (e) {
      hadError = true;
      console.warn(`    ⚠️  ${source.label} : ${e.message}`);
      continue;
    }
    for (const url of candidates) {
      try {
        const dims = await validateImage(url);
        if (dims) return { url, source, ...dims, hadError };
      } catch {
        hadError = true;
      }
    }
  }
  return { url: null, hadError };
}

// ---------- Supabase helpers ----------
async function fetchAllProducts() {
  const pageSize = 1000;
  const all = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image_url')
      .order('id')
      .range(from, from + pageSize - 1);
    if (error) throw error;
    all.push(...data);
    if (data.length < pageSize) break;
  }
  return all;
}

async function loadResults() {
  try {
    return JSON.parse(await readFile(RESULTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// ---------- Main ----------
async function main() {
  const products = await fetchAllProducts();
  console.log(`📦 ${products.length} produits récupérés${DRY_RUN ? ' (dry-run)' : ''}`);
  if (!BING_API_KEY) console.log('ℹ️  BING_API_KEY absente : source Bing ignorée');

  const results = FORCE ? [] : await loadResults();
  const byId    = new Map(results.map((r) => [r.id, r]));
  const todo    = products.filter((p) => FORCE || byId.get(p.id)?.status !== 'updated').slice(0, LIMIT);
  const total   = todo.length;
  console.log(`🔎 ${total} produits à traiter\n`);

  const save = () => writeFile(RESULTS_FILE, JSON.stringify([...byId.values()], null, 2));

  process.on('SIGINT', async () => {
    await save();
    console.log('\n💾 results.json sauvegardé, arrêt.');
    process.exit(0);
  });

  let n = 0;
  for (const p of todo) {
    n++;
    const cleaned = cleanName(p.name);
    const kind    = kindOf(p.name);

    const entry = {
      id: p.id, name: p.name, cleaned_name: cleaned, kind,
      old_image_url: p.image_url, new_image_url: null,
      source: null, width: null, height: null,
      status: 'failed', error: null,
      at: new Date().toISOString(),
    };

    let found = { url: null };
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      found = await findImage(cleaned, kind);
      if (found.url || !found.hadError) break;
      if (attempt < MAX_ATTEMPTS) await sleep(3000);
    }

    if (!found.url) {
      entry.error = 'aucune image valide trouvée';
      console.log(`[${n}/${total}] ❌ ${cleaned}`);
    } else if (found.url === p.image_url) {
      Object.assign(entry, { status: 'unchanged', new_image_url: found.url, source: found.source.id });
      console.log(`[${n}/${total}] ➖ ${cleaned} → déjà à jour`);
    } else {
      let dbError = null;
      if (!DRY_RUN) {
        const { error } = await supabase.from('products').update({ image_url: found.url }).eq('id', p.id);
        dbError = error;
      }
      if (dbError) {
        entry.error = `supabase: ${dbError.message}`;
        console.log(`[${n}/${total}] ❌ ${cleaned} (${dbError.message})`);
      } else {
        Object.assign(entry, {
          status: DRY_RUN ? 'dry-run' : 'updated',
          new_image_url: found.url,
          source: found.source.id,
          width: found.width,
          height: found.height,
        });
        const fallback = found.source.id === 'bing' || found.source.id === 'ddg';
        console.log(
          fallback
            ? `[${n}/${total}] ⚠️  ${cleaned} → fallback ${found.source.label}\n      ${found.url}`
            : `[${n}/${total}] ✅ ${cleaned} → ${found.url}`
        );
      }
    }

    byId.set(p.id, entry);
    if (n % 10 === 0) await save();
  }

  await save();
  const all   = [...byId.values()];
  const count = (s) => all.filter((r) => r.status === s).length;
  console.log(`\n🏁 ${count('updated')} mis à jour, ${count('unchanged')} inchangés, ${count('failed')} échecs → ${RESULTS_FILE}`);
}

main().catch((e) => {
  console.error('💥 Erreur fatale :', e);
  process.exit(1);
});
