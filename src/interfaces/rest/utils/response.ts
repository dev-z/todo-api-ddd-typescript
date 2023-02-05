import {
  ConflictError,
  InvalidInputError,
  NotFoundError,
} from "@src/domain/types/errors";
import {
  EventContext,
  CONTEXT_KEYS,
} from "@src/interfaces/rest/utils/capture-context";

type ResponseHeader = { [header: string]: string };

interface ResponseBody {
  data: unknown;
  message: string;
  status?: string;
}

export interface Response {
  statusCode: number;
  headers: ResponseHeader;
  body: string;
}

export enum StatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  ERROR = 500,
}

export const RESPONSE_HEADERS: ResponseHeader = {
  "Content-Type": "application/json",
};

export function response(
  statusCode: StatusCodes,
  data: unknown = {},
  message = "",
  ctx: EventContext = {
    actor: "",
    requestId: "",
  }
): Response {
  const body: ResponseBody = {
    data,
    message,
  };
  const headers = {
    ...RESPONSE_HEADERS,
    [CONTEXT_KEYS.CORRELATION_ID_HEADER_NAME]: ctx.requestId,
  };
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

export function mapError(err: unknown, ctx: EventContext): Response {
  if (err instanceof NotFoundError) {
    return response(StatusCodes.NOT_FOUND, {}, err.message, ctx);
  } else if (err instanceof ConflictError) {
    return response(StatusCodes.CONFLICT, {}, err.message, ctx);
  } else if (err instanceof InvalidInputError) {
    return response(StatusCodes.BAD_REQUEST, {}, err.message, ctx);
  }
  return response(StatusCodes.ERROR, {}, "something went wrong", ctx);
}
