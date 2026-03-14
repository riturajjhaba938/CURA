const cache = new Map();

// Default TTL: 1 hour (3600000 ms)
const setCache = (key, value, ttl = 3600000) => {
  cache.set(key, { value, exp: Date.now() + ttl });
};

const getCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.exp) {
    cache.delete(key);
    return null;
  }
  return item.value;
};

const clearCache = () => cache.clear();

module.exports = {
  setCache,
  getCache,
  clearCache
};
