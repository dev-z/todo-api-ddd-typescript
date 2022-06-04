import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  local: {
    client: "postgres",
    connection:
      process.env.TODO_DATABASE_URL ||
      "postgres://postgres:password@localhost:5432/todo_local",
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
