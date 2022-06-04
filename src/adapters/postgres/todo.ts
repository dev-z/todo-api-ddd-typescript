import { Knex } from "knex";
import { nanoid } from "nanoid";

import { Item, List, ListsRepository } from "@src/domain/types/todo";

type ListRecord = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

type ItemRecord = {
  id: string;
  name: string;
  list_id: string;
  created_at: Date;
  updated_at: Date;
};

const TABLES = {
  LISTS: "lists",
  ITEMS: "items",
};

function mapToItem(record: ItemRecord): Item {
  return {
    id: record.id,
    name: record.name,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapToList(record: ListRecord): List {
  return {
    id: record.id,
    name: record.name,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export class PGListsRepository implements ListsRepository {
  private readonly connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(name: string): Promise<List> {
    const [list] = await this.connection<ListRecord>(TABLES.LISTS)
      .insert({
        id: nanoid(),
        name,
      })
      .returning("*");

    return mapToList(list);
  }

  async list(count: number, offset: number): Promise<List[]> {
    const lists = await this.connection<ListRecord>(TABLES.LISTS)
      .select("*")
      .limit(count)
      .offset(offset);

    return lists.map(mapToList);
  }

  async getItems(
    listId: string,
    count: number,
    offset: number
  ): Promise<Item[]> {
    const items = await this.connection<ItemRecord>(TABLES.ITEMS)
      .select("*")
      .where({ list_id: listId })
      .limit(count)
      .offset(offset);

    return items.map(mapToItem);
  }

  async addItem(listId: string, itemName: string): Promise<Item> {
    const [item] = await this.connection<ItemRecord>(TABLES.ITEMS)
      .insert({
        id: nanoid(),
        name: itemName,
        list_id: listId,
      })
      .returning("*");

    return mapToItem(item);
  }

  async removeItem(itemId: string): Promise<string> {
    await this.connection(TABLES.ITEMS).where({ id: itemId }).del();
    return "success";
  }
}
