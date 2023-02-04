import { mockListsRepository } from "@src/mocks/repo";
import createAddItemAction from "@src/domain/todo/add-item";
import { mockItem } from "@src/mocks/model";

function createContext() {
  const listsRepo = mockListsRepository();
  const addItem = createAddItemAction({
    listsRepo,
  });
  return {
    listsRepo,
    addItem,
  };
}

describe("add-item", () => {
  test("should successfully add an item to a list", async () => {
    const ctx = createContext();
    const input = {
      listId: "list1",
      name: "Lorem",
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.addItem.mockResolvedValueOnce(
      mockItem({ id: "item1", name: "Lorem" })
    );
    const res = await ctx.addItem(input);
    expect(ctx.listsRepo.addItem).toHaveBeenCalledWith("list1", "Lorem");
    expect(res.id).toBe("item1");
    expect(res.name).toBe("Lorem");
  });

  test("should throw an error if list repository fails", async () => {
    const ctx = createContext();
    const input = {
      listId: "list1",
      name: "Lorem",
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.addItem.mockRejectedValueOnce(new Error("list repo failed"));
    const res = ctx.addItem(input);
    await expect(res).rejects.toThrow("list repo failed");
    expect(ctx.listsRepo.addItem).toHaveBeenCalledWith("list1", "Lorem");
  });
});
