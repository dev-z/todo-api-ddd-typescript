import knex, { Knex } from "knex";
import path from "path";

export interface TestDBContext {
  knex: Knex;
  dbName: string;
  destroy(): Promise<void>;
}

export function connection(dbName = "postgres"): Knex {
  const conn =
    process.env.TODO_DATABASE_URL ||
    "postgres://postgres:password@localhost:5432";

  return knex({
    client: "postgres",
    connection: `${conn}/${dbName}`,
  });
}

export async function createDB(name: string): Promise<void> {
  const conn = connection();
  try {
    await conn.raw(`CREATE DATABASE ${name}`);
  } finally {
    await conn.destroy();
  }
}

export async function dropDB(name: string): Promise<void> {
  const conn = connection();
  try {
    await conn.raw(`DROP DATABASE ${name}`);
  } finally {
    await conn.destroy();
  }
}

export async function seed(name: string): Promise<Knex> {
  const conn = connection(name);
  try {
    await conn.migrate.latest({
      directory: path.join(__dirname, "migrations"),
    });
    return conn;
  } catch (err) {
    await conn.destroy();
    throw err;
  }
}

export default async function createTestDB(): Promise<TestDBContext> {
  const dbName = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  await createDB(dbName);
  const connection = await seed(dbName);
  return {
    knex: connection,
    dbName,
    async destroy(): Promise<void> {
      await connection.destroy();
      await dropDB(dbName);
    },
  };
}
