import { ListsRepository } from "@src/domain/types/todo";

export function mockListsRepository(): jest.Mocked<ListsRepository> {
  return {
    create: jest.fn(),
    list: jest.fn(),
    addItem: jest.fn(),
    getItems: jest.fn(),
    removeItem: jest.fn(),
  };
}
