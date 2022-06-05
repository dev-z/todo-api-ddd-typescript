import knex from "knex";
import { getValueFromEnv } from "@src/utils/system";
import withLogger from "@src/interfaces/lambda-http/utils/with-logger";
import createHandler from "./handler";
import createCreateListAction from "@src/domain/todo/create-list";
import { PGListsRepository } from "@src/adapters/postgres/todo";

const dbConnection = knex({
  client: "postgres",
  connection: getValueFromEnv("TODO_DATABASE_URL"),
});

const listsRepo = new PGListsRepository(dbConnection);

export const handler = withLogger(
  createHandler({
    createList: createCreateListAction({ listsRepo }),
  })
);
