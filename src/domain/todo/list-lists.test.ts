import { mockListsRepository } from "@src/mocks/repo";
import createListListsAction from "@src/domain/todo/list-lists";
import { mockList } from "@src/mocks/model";

function createContext() {
  const listsRepo = mockListsRepository();
  const listLists = createListListsAction({
    listsRepo,
  });
  return {
    listsRepo,
    listLists,
  };
}

describe("list-lists", () => {
  test("should successfully return a list of todo-lists", async () => {
    const ctx = createContext();
    const input = {
      count: 50,
      offset: 0,
      metadata: { requestId: "test1", actor: "jest" },
    };
    const lists = [mockList(), mockList(), mockList()];
    ctx.listsRepo.list.mockResolvedValueOnce(lists);
    const res = await ctx.listLists(input);
    expect(ctx.listsRepo.list).toHaveBeenCalledWith(50, 0);
    expect(res).toStrictEqual(lists);
  });

  test("should throw an error if list repository fails", async () => {
    const ctx = createContext();
    const input = {
      count: 50,
      offset: 0,
      metadata: { requestId: "test1", actor: "jest" },
    };
    ctx.listsRepo.list.mockRejectedValueOnce(new Error("list repo failed"));
    const res = ctx.listLists(input);
    await expect(res).rejects.toThrow("list repo failed");
    expect(ctx.listsRepo.list).toHaveBeenCalledWith(50, 0);
  });
});
