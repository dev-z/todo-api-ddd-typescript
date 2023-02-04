import { mockListsRepository } from "@src/mocks/repo";
import createListItemsAction from "@src/domain/todo/list-items";
import { mockItem } from "@src/mocks/model";

function createContext() {
  const listsRepo = mockListsRepository();
  const listItems = createListItemsAction({
    listsRepo,
  });
  return {
    listsRepo,
    listItems,
  };
}

describe("list-items", () => {
  test("should successfully return items belonging to a list", async () => {
    const ctx = createContext();
    const input = {
      listId: "l1",
      count: 50,
      offset: 0,
      metadata: { requestId: "test1", actor: "jest" },
    };
    const items = [mockItem(), mockItem(), mockItem()];
    ctx.listsRepo.getItems.mockResolvedValueOnce(items);
    const res = await ctx.listItems(input);
    expect(ctx.listsRepo.getItems).toHaveBeenCalledWith("l1", 50, 0);
    expect(res).toStrictEqual(items);
  });

  test("should throw an error if list repository fails", async () => {
    const ctx = createContext();
    const input = {
      listId: "l1",
      count: 50,
      offset: 0,
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.getItems.mockRejectedValueOnce(new Error("list repo failed"));
    const res = ctx.listItems(input);
    await expect(res).rejects.toThrow("list repo failed");
    expect(ctx.listsRepo.getItems).toHaveBeenCalledWith("l1", 50, 0);
  });
});
