import { readFile } from "fs/promises";
import { AwsFunctionHandler, Serverless } from "serverless/aws";
import * as config from "./serverless";

const sls = config as Serverless;
const lambdas = Object.entries(sls.functions || {});

describe("Serverless Configuration", () => {
  describe("lambda handlers exist", () => {
    lambdas.forEach(([name, def]) => {
      const { handler } = def as AwsFunctionHandler;
      const parts = handler.split(".");
      const exportName = parts.pop();
      const handlerPath = parts.join(".") + ".ts";

      test(`${name} should have a valid handler`, async () => {
        const data = await readFile(handlerPath);
        const js = data.toString("utf-8");

        expect(exportName).not.toHaveLength(0);
        expect(js).toContain(`export const ${exportName || ""}`);
      });
    });
  });
});
