import NodeCache from "node-cache";
import MedicineCache from "../models/MedicineCache";
import logger from "../utils/logger";

// In-memory L1 cache (5 min) – reduces MongoDB round trips
const memCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

function makeCacheKey(name: string, lang: string) {
  return `${lang}:${name.toLowerCase().trim()}`;
}

async function getCache(name: string, lang: string) {
  const key = makeCacheKey(name, lang);

  // 1. Check memory cache
  const memHit = memCache.get(key);
  if (memHit) {
    logger.debug(`L1 cache hit: ${key}`);
    return { data: memHit, source: "memory" };
  }

  // 2. Check MongoDB cache
  try {
    const doc = await MedicineCache.findOne({ cacheKey: key });
    if (doc) {
      // Increment hit count async (don't await)
      MedicineCache.updateOne({ cacheKey: key }, { $inc: { hitCount: 1 } }).catch(() => {});
      const { _id, __v, cacheKey, medicineName, hitCount, expiresAt, createdAt, updatedAt, ...cleanData } = doc.toObject();
      memCache.set(key, cleanData); // Warm L1 cache
      logger.debug(`L2 (MongoDB) cache hit: ${key}`);
      return { data: cleanData, source: "mongodb" };
    }
  } catch (err: any) {
    logger.warn(`Cache read error: ${err.message}`);
  }

  return null;
}

async function setCache(name: string, lang: string, data: any) {
  const key = makeCacheKey(name, lang);
  memCache.set(key, data);

  try {
    await MedicineCache.findOneAndUpdate(
      { cacheKey: key },
      {
        cacheKey:       key,
        medicineName:   name.toLowerCase().trim(),
        lang,
        ...data,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err: any) {
    logger.warn(`Cache write error: ${err.message}`);
  }
}

export default { getCache, setCache, makeCacheKey };
