export type Item = {
  id: string;
  name: string;
};

export type List = {
  id: string;
  name: string;
};

export interface ListsRepository {
  create(name: string): Promise<List>;
  list(count: number, offset: number): Promise<List[]>;
  getItems(listId: string, count: number, offset: number): Promise<Item[]>;
  addItem(listId: string, itemName: string): Promise<Item>;
  removeItem(itemId: string): Promise<string>;
}
