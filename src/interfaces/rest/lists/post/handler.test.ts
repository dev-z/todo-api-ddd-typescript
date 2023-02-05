import createHandler from "@src/interfaces/rest/lists/post/handler";
import { mockList } from "@src/mocks/model";
import { invoke } from "@src/interfaces/rest/utils/test-utils";

function createContext() {
  const createList = jest.fn();
  const event = {
    headers: {
      "x-actor": "jest",
      "x-request-id": "handler-post-lists",
    },
    body: JSON.stringify({ name: "MyTestList" }),
  };
  return {
    createList,
    event,
    handler: createHandler({ createList }),
  };
}

describe("POST /lists", () => {
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

  test("should return 400 on missing body", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, { headers: ctx.event.headers });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      JSON.stringify({
        data: {},
        message: "body is not valid JSON",
      })
    );
  });

  test("should return 400 on invalid body", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
      body: "invalidJSON",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(
      JSON.stringify({
        data: {},
        message: "body is not valid JSON",
      })
    );
  });

  test("should return 400 on missing required property", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
      body: JSON.stringify({}),
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("missing/invalid properties");
    expect(res.body).toContain("must have required property 'name'");
  });

  test("should return 400 on invalid name", async () => {
    const ctx = createContext();
    const res = await invoke(ctx.handler, {
      headers: ctx.event.headers,
      body: JSON.stringify({
        name: "werywhbrfsud8cuwiejnrwe9fjiwnefoiewjfnwefijnwefwejinfvdfijfhbedivfjhwbdvijfbfdvsjifwfjhiowdfwgdfgdfgdfg",
      }),
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("missing/invalid properties");
    expect(res.body).toContain("must NOT have more than 100 characters");
  });

  test("should return 500 if create fails", async () => {
    const ctx = createContext();
    ctx.createList.mockRejectedValueOnce(new Error("something went wrong"));
    const res = await invoke(ctx.handler, ctx.event);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual(
      JSON.stringify({
        data: {},
        message: "something went wrong",
      })
    );
  });

  test("should return 200 on successful creation", async () => {
    const ctx = createContext();
    const list = mockList({ name: "MyTestList" });
    ctx.createList.mockResolvedValueOnce(list);
    const res = await invoke(ctx.handler, ctx.event);
    expect(ctx.createList).toHaveBeenCalledWith({
      name: "MyTestList",
      metadata: {
        actor: "jest",
        requestId: "handler-post-lists",
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      JSON.stringify({
        data: {
          id: list.id,
          name: list.name,
          createdAt: list.createdAt,
          updatedAt: list.updatedAt,
        },
        message: "",
      })
    );
  });
});
