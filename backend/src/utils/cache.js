/**
 * Cache mémoire simple avec TTL (Time To Live)
 * Évite les appels répétés à Supabase pour les données peu changeantes
 */

const store = new Map();

/**
 * Récupère une valeur du cache ou l'initialise via le callback
 * @param {string} key  - Clé unique du cache
 * @param {Function} fn - Fonction async qui retourne la donnée fraîche
 * @param {number} ttl  - Durée de vie en ms (défaut : 30s)
 */
export const cached = async (key, fn, ttl = 30_000) => {
  const now = Date.now();
  const hit = store.get(key);

  if (hit && now - hit.ts < ttl) {
    return hit.value;
  }

  const value = await fn();
  store.set(key, { value, ts: now });
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
