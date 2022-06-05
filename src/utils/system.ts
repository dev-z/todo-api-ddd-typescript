import createLogger from "./logger";

export function getValueFromEnv(name: string): string {
  const logger = createLogger("system");
  const value = process.env[name];
  if (!value) {
    logger.error("invalid configuration", {
      name,
      actor: "aws",
      err: "env variable not found",
    });
    throw new Error("missing env variable");
  }
  return value;
}
