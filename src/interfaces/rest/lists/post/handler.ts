import { APIGatewayProxyHandler } from "aws-lambda";
import Ajv, { JSONSchemaType } from "ajv";
import {
  CreateList,
  Input as CreateListInput,
} from "@src/domain/todo/create-list";
import { captureEventContext } from "@src/interfaces/rest/utils/capture-context";
import {
  response,
  StatusCodes,
  mapError,
} from "@src/interfaces/rest/utils/response";

export interface Input {
  name: string;
}

export interface Dependencies {
  createList: CreateList;
}

const inputSchema: JSONSchemaType<Input> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
  },
  required: ["name"],
};
const valididateInput = new Ajv().compile(inputSchema);

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
    let input: Input;
    try {
      input = JSON.parse(event.body || "") as Input;
    } catch (bodyErrr) {
      return response(
        StatusCodes.BAD_REQUEST,
        {},
        "body is not valid JSON",
        ctx
      );
    }
    if (!valididateInput(input)) {
      return response(
        StatusCodes.BAD_REQUEST,
        { errors: valididateInput.errors },
        "missing/invalid properties",
        ctx
      );
    }
    const createListInput: CreateListInput = {
      name: input.name,
      metadata: ctx,
    };
    try {
      const list = await deps.createList(createListInput);
      return response(StatusCodes.SUCCESS, list, "", ctx);
    } catch (createErr) {
      return mapError(createErr, ctx);
    }
  };
}
