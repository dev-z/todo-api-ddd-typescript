import { faker } from "@faker-js/faker";
import { Item, List } from "@src/domain/types/todo";

export function mockItem(item: Partial<Item> = {}): Item {
  return {
    id: faker.datatype.uuid(),
    listId: faker.datatype.uuid(),
    name: faker.lorem.word(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...item,
  };
}

export function mockList(item: Partial<List> = {}): List {
  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.word(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...item,
  };
}
