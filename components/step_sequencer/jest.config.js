/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  roots: ["<rootDir>"],
  moduleFileExtensions: ["ts", "js"],
  preset: "ts-jest",
  transformIgnorePatterns: ["/node_modules/"],
};
