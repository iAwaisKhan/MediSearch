import cacheService from "../services/cacheService";
import MedicineCache from "../models/MedicineCache";

jest.mock("../models/MedicineCache");

describe("Cache Service", () => {
  it("should generate correct cache key", () => {
    // @ts-ignore
    const key = cacheService.makeCacheKey("Aspirin", "EN");
    expect(key).toBe("en:aspirin");
  });

  it("should return null if cache is empty", async () => {
    (MedicineCache.findOne as jest.Mock).mockResolvedValue(null);
    // @ts-ignore
    const result = await cacheService.getCache("aspirin", "en");
    expect(result).toBeNull();
  });
});
