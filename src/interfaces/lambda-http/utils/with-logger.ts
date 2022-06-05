import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import createLogger, { Logger } from "@src/utils/logger";
import { captureEventContext } from "@src/interfaces/lambda-http/utils/capture-context";

function mapStatusCode(code: number): string {
  return `http_${Math.floor(code / 100)}xx`;
}

function logResult(
  l: Logger,
  start: Date,
  ev: APIGatewayProxyEvent,
  ctx: Context,
  res: APIGatewayProxyResult
): void {
  const ms = Date.now() - start.getTime();
  const { actor } = captureEventContext(ev.headers, ctx);
  l.info("result", {
    actor,
    ms,
    path: ev.path,
    status: res.statusCode,
    method: ev.httpMethod.toLowerCase(),
    [mapStatusCode(res.statusCode)]: 1,
  });
}

export default function withLogger(
  handler: APIGatewayProxyHandler
): APIGatewayProxyHandler {
  return (event, context, cb) => {
    const start = new Date();
    const logger = createLogger("rl");
    // This is not really nice to look at but we need to handle
    // both implementations of a handler, with and without callback.
    let p = handler(event, context, (err, res) => {
      if (res) {
        logResult(logger, start, event, context, res);
      }
      return cb(err, res);
    });
    if (p instanceof Promise) {
      p = p.then((res) => {
        logResult(logger, start, event, context, res);
        return res;
      });
    }
    return p;
  };
}
