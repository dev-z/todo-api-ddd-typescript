# DB setup

## ER Diagram

```
-------     -----------
|lists|     |items    |
-------     -----------
|id   |1-|  |id       |
|name |  |  |name     |
|     |  |-N|list_id  |
-------     -----------
```

It's a simple setup with two tables: `lists` and `items` with a 1:N relationship between lists and items because 1 list can have multiple items.

## Migrations

We use knex for connecting to our DB. It comes bundled with the Knex CLI which can help us create migration files.

Migrations help us maintain our DB Schema as code.

To create a new migration file:

```bash
npx knex migrate:make <PLEASE_GIVE_A_NAME_HERE> --knexfile ./src/adapters/postgres/knexfile.ts
```

This would create a new file in `/src/adapters/postgres/migrations` folder which would something like:

```typescript
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Write the changes you want here
  // This function is executed in when we apply "knex migrate:latest" command
}

export async function down(knex: Knex): Promise<void> {
  // Write migrations that should revert the changes from the "up" function above
  // This function is executed in when we apply "knex migrate:rollback" command
}
```

For further info, read the [knex docs](http://knexjs.org/#Migrations-CLI)
