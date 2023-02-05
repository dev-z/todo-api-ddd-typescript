import { APIGatewayProxyHandler } from "aws-lambda";
import Ajv, { JSONSchemaType } from "ajv";
import {
  ListLists,
  Input as ListListsInput,
} from "@src/domain/todo/list-lists";
import { captureEventContext } from "@src/interfaces/rest/utils/capture-context";
import {
  response,
  StatusCodes,
  mapError,
} from "@src/interfaces/rest/utils/response";

export interface Input {
  count?: number;
  offset?: number;
}

export interface Dependencies {
  listLists: ListLists;
}

const inputSchema: JSONSchemaType<Input> = {
  type: "object",
  properties: {
    count: { type: "number", minimum: 0, maximum: 100, nullable: true },
    offset: { type: "number", minimum: 0, nullable: true },
  },
};
const valididateInput = new Ajv().compile(inputSchema);

const DEFAULT_COUNT = 50;
const DEFAULT_OFFSET = 0;

export default function createHandler(
  deps: Dependencies
): APIGatewayProxyHandler {
  return async (event, context) => {
    const ctx = captureEventContext(event.headers, context);
    if (!ctx.actor) {
      return response(
        StatusCodes.BAD_REQUEST,
        {},
        "header x-actor is required",
        ctx
      );
    }
    const { count, offset } = event.queryStringParameters || {};
    const input: Input = {
      count: count ? Number(count) : undefined,
      offset: offset ? Number(offset) : undefined,
    };
    if (!valididateInput(input)) {
      return response(
        StatusCodes.BAD_REQUEST,
        { errors: valididateInput.errors },
        "invalid query params",
        ctx
      );
    }
    const listListsInput: ListListsInput = {
      count: input.count || DEFAULT_COUNT,
      offset: input.offset || DEFAULT_OFFSET,
      metadata: ctx,
    };
    try {
      const list = await deps.listLists(listListsInput);
      return response(StatusCodes.SUCCESS, list, "", ctx);
    } catch (err) {
      return mapError(err, ctx);
    }
  };
}
