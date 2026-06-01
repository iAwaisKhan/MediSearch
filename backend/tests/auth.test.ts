import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import User from "../models/User";

jest.mock("../models/User");

describe("Auth Endpoints", () => {
  it("should reject login with missing credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid@example.com" });
    expect(res.status).toBe(422);
  });
});
