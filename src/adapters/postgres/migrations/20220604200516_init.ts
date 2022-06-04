import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("lists", (table) => {
      table.string("id", 50).notNullable().primary();
      table.string("name", 100).notNullable();
      table.timestamps(true, true);
    })
    .createTable("items", (table) => {
      table.string("id", 50).notNullable().primary();
      table.string("name", 100).notNullable();
      table.timestamps(true, true);
      table.string("list_id", 50).notNullable().index();
      table.foreign("list_id").references("lists.id");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("items").dropTable("lists");
}
