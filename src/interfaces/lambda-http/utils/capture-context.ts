import { APIGatewayEvent, Context } from "aws-lambda";
import { nanoid } from "nanoid";

export type EventContext = {
  actor: string;
  requestId: string;
};

export const CONTEXT_KEYS = {
  CORRELATION_ID_HEADER_NAME:
    process.env.CORRELATION_ID_HEADER_NAME || "x-request-id",
  AUTH_ACTOR: process.env.ACTOR_HEADER_NAME || "x-actor",
};

export const createTraceId = (correlationId?: string): string => {
  const id: string = nanoid();
  return correlationId || id;
};

export function captureEventContext(
  headers?: APIGatewayEvent["headers"],
  context?: Context
): EventContext {
  const requestId =
    headers?.[CONTEXT_KEYS.CORRELATION_ID_HEADER_NAME] ||
    context?.awsRequestId ||
    createTraceId();
  const actor = headers?.[CONTEXT_KEYS.AUTH_ACTOR] ?? "";
  return {
    requestId,
    actor,
  };
}
