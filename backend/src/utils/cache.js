/**
 * Cache mémoire simple avec TTL (Time To Live)
 * Évite les appels répétés à Supabase pour les données peu changeantes
 * B8 — Taille maximale + purge périodique des entrées expirées
 */

const store = new Map();
const MAX_ENTRIES = 1000; // B8 — limite mémoire
const SEARCH_MAX_LENGTH = 100; // B8 — limite longueur des clés de recherche

/**
 * Récupère une valeur du cache ou l'initialise via le callback
 * @param {string} key  - Clé unique du cache
 * @param {Function} fn - Fonction async qui retourne la donnée fraîche
 * @param {number} ttl  - Durée de vie en ms (défaut : 30s)
 */
export const cached = async (key, fn, ttl = 30_000) => {
  // B8 — tronquer les clés trop longues (saisies de recherche illimitées)
  const safeKey = key.length > SEARCH_MAX_LENGTH * 4 ? key.slice(0, SEARCH_MAX_LENGTH * 4) : key;
  const now = Date.now();
  const hit = store.get(safeKey);

  if (hit && now - hit.ts < ttl) {
    return hit.value;
  }

  // B8 — éviction LRU simplifiée : si le cache est plein, vider les entrées expirées d'abord
  if (store.size >= MAX_ENTRIES) {
    for (const [k, v] of store.entries()) {
      if (now - v.ts >= ttl) store.delete(k);
    }
    // Si toujours plein après purge, vider la moitié la plus ancienne
    if (store.size >= MAX_ENTRIES) {
      const entries = [...store.entries()].sort((a, b) => a[1].ts - b[1].ts);
      entries.slice(0, Math.floor(MAX_ENTRIES / 2)).forEach(([k]) => store.delete(k));
    }
  }

  const value = await fn();
  store.set(safeKey, { value, ts: now });
  return value;
};

/**
 * Invalide une ou plusieurs entrées du cache
 * @param {...string} keys - Clés à supprimer (accepte des préfixes avec *)
 */
export const invalidate = (...keys) => {
  for (const key of keys) {
    if (key.endsWith('*')) {
      const prefix = key.slice(0, -1);
      for (const k of store.keys()) {
        if (k.startsWith(prefix)) store.delete(k);
      }
    } else {
      store.delete(key);
    }
  }
};

/** Vide tout le cache */
export const clearAll = () => store.clear();

// B8 — Purge périodique toutes les 5 minutes pour éviter l'accumulation d'entrées expirées
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    // On purge les entrées vieilles de plus de 10 minutes (au-delà du TTL max utilisé)
    if (now - v.ts > 10 * 60_000) store.delete(k);
  }
}, 5 * 60_000);
