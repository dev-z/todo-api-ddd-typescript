import { mockListsRepository } from "@src/mocks/repo";
import createCreateListAction from "@src/domain/todo/create-list";
import { mockList } from "@src/mocks/model";

function createContext() {
  const listsRepo = mockListsRepository();
  const createList = createCreateListAction({
    listsRepo,
  });
  return {
    listsRepo,
    createList,
  };
}

describe("create-list", () => {
  test("should successfully create a list", async () => {
    const ctx = createContext();
    const input = {
      name: "Lorem",
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.create.mockResolvedValueOnce(mockList({ name: "Lorem" }));
    const res = await ctx.createList(input);
    expect(ctx.listsRepo.create).toHaveBeenCalledWith("Lorem");
    expect(res.name).toBe("Lorem");
  });

  test("should throw an error if list repository fails", async () => {
    const ctx = createContext();
    const input = {
      name: "Lorem",
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.create.mockRejectedValueOnce(new Error("list repo failed"));
    const res = ctx.createList(input);
    await expect(res).rejects.toThrow("list repo failed");
    expect(ctx.listsRepo.create).toHaveBeenCalledWith("Lorem");
  });
});
