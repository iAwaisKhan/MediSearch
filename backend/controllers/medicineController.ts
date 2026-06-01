import aiService from "../services/aiService";
import cacheService from "../services/cacheService";
import SearchHistory from "../models/SearchHistory";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import logger from "../utils/logger";

// ── POST /api/medicine/search ────────────────────────────────────────────
export const searchMedicine = catchAsync(async (req: any, res: any, next: any) => {
  const name = (req.query.name || "").trim();
  const lang = req.query.lang === "hi" ? "hi" : "en";
  const start = Date.now();

  if (!name) return next(new AppError("Medicine name is required.", 400));

  // 1. Cache lookup (L1 memory → L2 MongoDB)
  const cached = await cacheService.getCache(name, lang);
  if (cached) {
    if (req.user) {
      SearchHistory.create({
        user: req.user.id, type: "search", query: name, lang,
        resultFound: true, cachedResult: true, responseTimeMs: Date.now() - start,
      }).catch(() => {});
    }
    return res.status(200).json({
      status: "success",
      cached: true,
      cacheSource: cached.source,
      data: cached.data,
    });
  }

  // 2. Call AI
  const data = await aiService.fetchMedicine(name, lang);

  if (data?.error) {
    if (req.user) {
      SearchHistory.create({
        user: req.user.id, type: "search", query: name, lang,
        resultFound: false, cachedResult: false, responseTimeMs: Date.now() - start,
      }).catch(() => {});
    }
    return res.status(404).json({ status: "fail", message: "Medicine not found." });
  }

  // 3. Store in cache
  await cacheService.setCache(name, lang, data);

  // 4. Save to user history
  if (req.user) {
    SearchHistory.create({
      user: req.user.id, type: "search", query: name, lang,
      resultFound: true, cachedResult: false, responseTimeMs: Date.now() - start,
    }).catch(() => {});
  }

  logger.info(`Medicine searched: "${name}" (${lang}) in ${Date.now() - start}ms`);

  res.status(200).json({
    status: "success",
    cached: false,
    cacheSource: "none",
    data,
  });
});

// ── GET /api/medicine/compare ────────────────────────────────────────────
export const compareMedicines = catchAsync(async (req: any, res: any, next: any) => {
  const a    = (req.query.a || "").trim();
  const b    = (req.query.b || "").trim();
  const lang = req.query.lang === "hi" ? "hi" : "en";
  const start = Date.now();

  if (!a || !b) return next(new AppError("Both medicine names are required.", 400));

  // Check both in cache independently
  const [cachedA, cachedB] = await Promise.all([
    cacheService.getCache(a, lang),
    cacheService.getCache(b, lang),
  ]);

  let results;
  let wasCached = false;

  if (cachedA && cachedB) {
    results   = [cachedA.data, cachedB.data];
    wasCached = true;
  } else {
    // Ask AI to compare both at once (1 API call)
    const arr = await aiService.fetchCompare(a, b, lang);

    if (!Array.isArray(arr) || arr.length < 2) {
      return next(new AppError("Could not compare these medicines. Please check the names.", 422));
    }

    results = arr;
    // Cache each individually
    await Promise.all([
      cacheService.setCache(a, lang, arr[0]),
      cacheService.setCache(b, lang, arr[1]),
    ]);
  }

  if (req.user) {
    SearchHistory.create({
      user: req.user.id, type: "compare", query: a, compareWith: b, lang,
      resultFound: true, cachedResult: wasCached, responseTimeMs: Date.now() - start,
    }).catch(() => {});
  }

  logger.info(`Compare: "${a}" vs "${b}" (${lang}) in ${Date.now() - start}ms`);

  res.status(200).json({
    status: "success",
    cached: wasCached,
    data: results,
  });
});
