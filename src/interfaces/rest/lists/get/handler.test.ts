import createHandler from "@src/interfaces/rest/lists/get/handler";
import { mockList } from "@src/mocks/model";
import { invoke } from "@src/interfaces/rest/utils/test-utils";

function createContext() {
  const listLists = jest.fn();
  const event = {
    headers: {
      "x-actor": "jest",
      "x-request-id": "handler-get-lists",
    },
    queryStringParameters: {
      count: "60",
      offset: "10",
    },
  };
  return {
    listLists,
    event,
    handler: createHandler({ listLists }),
  };
}

describe("GET /lists", () => {
  test("should return 400 on missing actor", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, { headers: {} });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      JSON.stringify({
        data: {},
        message: "header x-actor is required",
      })
    );
  });

  test("should return 400 on offset < 0", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
      queryStringParameters: { offset: "-1" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("invalid query params");
    expect(res.body).toContain("must be >= 0");
  });

  test("should return 400 on count < 0", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
      queryStringParameters: { count: "-1" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("invalid query params");
    expect(res.body).toContain("must be >= 0");
  });

  test("should return 400 on count > 100", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
      queryStringParameters: { count: "1000" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("invalid query params");
    expect(res.body).toContain("must be <= 100");
  });

  test("should return 400 on invalid count", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
      queryStringParameters: { count: "hahaha" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("invalid query params");
    expect(res.body).toContain("must be number");
  });

  test("should return 500 if list fails", async () => {
    const ctx = createContext();
    ctx.listLists.mockRejectedValueOnce(new Error("something went wrong"));
    const res = await invoke(ctx.handler, ctx.event);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual(
      JSON.stringify({
        data: {},
        message: "something went wrong",
      })
    );
  });

  test("should use default values if no query params are passed and return 200", async () => {
    const ctx = createContext();
    const lists = [mockList(), mockList(), mockList()];
    ctx.listLists.mockResolvedValueOnce(lists);
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
    });
    expect(ctx.listLists).toHaveBeenCalledWith({
      count: 50,
      offset: 0,
      metadata: {
        actor: "jest",
        requestId: "handler-get-lists",
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      JSON.stringify({
        data: lists,
        message: "",
      })
    );
  });

  test("should use given values if query params are passed and return 200", async () => {
    const ctx = createContext();
    const lists = [mockList(), mockList(), mockList()];
    ctx.listLists.mockResolvedValueOnce(lists);
    const res = await invoke(ctx.handler, ctx.event);
    expect(ctx.listLists).toHaveBeenCalledWith({
      count: 60,
      offset: 10,
      metadata: {
        actor: "jest",
        requestId: "handler-get-lists",
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      JSON.stringify({
        data: lists,
        message: "",
      })
    );
  });
});
