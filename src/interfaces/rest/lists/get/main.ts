import knex from "knex";
import { getValueFromEnv } from "@src/utils/system";
import withLogger from "@src/interfaces/rest/utils/with-logger";
import createHandler from "@src/interfaces/rest/lists/get/handler";
import createListListsAction from "@src/domain/todo/list-lists";
import { PGListsRepository } from "@src/adapters/postgres/todo";

const dbConnection = knex({
  client: "postgres",
  connection: getValueFromEnv("TODO_DATABASE_URL"),
});

const listsRepo = new PGListsRepository(dbConnection);

export const handler = withLogger(
  createHandler({
    listLists: createListListsAction({ listsRepo }),
  })
);
