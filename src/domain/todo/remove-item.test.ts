import { mockListsRepository } from "@src/mocks/repo";
import createRemoveItemAction from "@src/domain/todo/remove-item";

function createContext() {
  const listsRepo = mockListsRepository();
  const removeItem = createRemoveItemAction({
    listsRepo,
  });
  return {
    listsRepo,
    removeItem,
  };
}

describe("remove-item", () => {
  test("should successfully remove an item from a list", async () => {
    const ctx = createContext();
    const input = {
      id: "i1",
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.removeItem.mockResolvedValueOnce("success");
    const res = await ctx.removeItem(input);
    expect(ctx.listsRepo.removeItem).toHaveBeenCalledWith("i1");
    expect(res).toStrictEqual("success");
  });

  test("should throw an error if list repository fails", async () => {
    const ctx = createContext();
    const input = {
      id: "i1",
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.removeItem.mockRejectedValueOnce(
      new Error("list repo failed")
    );
    const res = ctx.removeItem(input);
    await expect(res).rejects.toThrow("list repo failed");
    expect(ctx.listsRepo.removeItem).toHaveBeenCalledWith("i1");
  });
});
