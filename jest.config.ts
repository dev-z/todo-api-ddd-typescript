import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: false,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/postgres/migrations"],
  coverageReporters: ["text", "html", "cobertura"],
  // For supporting absolute imports
  moduleNameMapper: {
    "@src/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
