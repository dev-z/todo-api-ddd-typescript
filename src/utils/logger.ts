import * as winston from "winston";
import VERSION from "@src/version";

/**
 * Defines a log entry.
 * Allows us to enforce that an actor is always log to allow us to audit who had requested that particular execution
 * This actor can come from your request authorizer or any header that you enforce to be present in every request
 */
type Entry = Record<string, unknown> & { actor: string };

/**
 * Defines an error entry.
 * Same as reglar entry but also enforces that you pass in the error's message as input so that it is logged
 */
type ErrorEntry = Entry & { err: string };

/**
 * Custom formatter that adds the time and version to your logs
 */
const customFormatter = winston.format((info) => {
  info.time = new Date().toISOString();
  info.v = VERSION;
  return info;
});

export interface Logger {
  debug(msg: string, entries: Entry): void;
  info(msg: string, entries: Entry): void;
  warn(msg: string, entries: Entry): void;
  error(msg: string, entries: ErrorEntry): void;
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(customFormatter(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test",
    }),
  ],
});

/**
 * Creates and returns a scoped instance of the logger
 * @param scope The scope of the loggger
 * @returns Logger
 */
export default function createLogger(scope: string): Logger {
  return {
    debug(msg: string, entries: Entry): void {
      logger.debug(msg, { ...entries, scope });
    },
    info(msg: string, entries: Entry): void {
      logger.info(msg, { ...entries, scope });
    },
    warn(msg: string, entries: Entry): void {
      logger.warn(msg, { ...entries, scope });
    },
    error(msg: string, entries: ErrorEntry): void {
      logger.error(msg, { ...entries, scope });
    },
  };
}
