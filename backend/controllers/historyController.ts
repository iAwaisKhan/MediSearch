import SearchHistory from "../models/SearchHistory";
import catchAsync from "../utils/catchAsync";

// GET /api/history  ?page=1&limit=20&type=search
export const getHistory = catchAsync(async (req: any, res: any) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;
  const filter: any = { user: req.user._id };
  if (req.query.type) filter.type = req.query.type;

  const [docs, total] = await Promise.all([
    SearchHistory.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    SearchHistory.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: docs.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: docs,
  });
});

// DELETE /api/history/:id
export const deleteHistoryItem = catchAsync(async (req: any, res: any, next: any) => {
  const doc = await SearchHistory.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!doc) return next(new (require("../utils/AppError"))("History item not found.", 404));
  res.status(200).json({ status: "success", message: "Deleted." });
});

// DELETE /api/history  (clear all)
export const clearHistory = catchAsync(async (req: any, res: any) => {
  await SearchHistory.deleteMany({ user: req.user.id });
  res.status(200).json({ status: "success", message: "History cleared." });
});

// GET /api/history/stats
export const getStats = catchAsync(async (req: any, res: any) => {
  const stats = await SearchHistory.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$type",
        count:  { $sum: 1 },
        avgMs:  { $avg: "$responseTimeMs" },
      },
    },
  ]);
  const topSearches = await SearchHistory.aggregate([
    { $match: { user: req.user._id, type: "search" } },
    { $group: { _id: "$query", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  res.status(200).json({ status: "success", data: { stats, topSearches } });
});
