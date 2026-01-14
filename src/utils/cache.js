const cache = new Map();

export const getCache = (key) => cache.get(key);

export const setCache = (key, data, ttl = 60000) => {
  cache.set(key, data);
  setTimeout(() => cache.delete(key), ttl);
};
