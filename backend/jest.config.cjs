/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  clearMocks: true,
  collectCoverageFrom: [
    "controllers/**/*.ts",
    "middleware/**/*.ts",
    "services/**/*.ts",
    "utils/**/*.ts",
    "!**/*.d.ts",
  ],
  coverageDirectory: "coverage",
};
