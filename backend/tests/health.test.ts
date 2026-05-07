const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("GET /api/health", () => {
  afterAll(async () => {
    // Close the DB connection so tests don't hang
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  it("should return 200 and health status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("env");
  });
});

export {};
