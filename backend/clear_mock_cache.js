const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MedicineCache = require("./models/MedicineCache");

async function clearMockCache() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not found in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const result = await MedicineCache.deleteMany({
      $or: [
        { name: "Mock Medicine" },
        { genericName: "Mock Generic" },
        { category: "Mock Category" },
        { purpose: /mocked medicine response/i },
        { purpose: /Mocked. Key is:/i }
      ]
    });

    console.log(`Deleted ${result.deletedCount} mock cache entries.`);
    process.exit(0);
  } catch (error) {
    console.error("Error clearing cache:", error);
    process.exit(1);
  }
}

clearMockCache();
