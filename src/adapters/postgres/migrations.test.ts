import { readdirSync } from "fs";
import path from "path";
import * as migrations from "@src/adapters/postgres/migrations";

describe("migrations tests", () => {
  const fileNames = readdirSync(path.join(__dirname, "./migrations")).filter(
    (x) => !x.includes("index")
  );

  fileNames.forEach((fileName) => {
    test(`${fileName} to be exported`, () => {
      const file = fileName.split(".ts")[0];
      expect(migrations).toHaveProperty(`migration_${file}`);
    });
  });
});
