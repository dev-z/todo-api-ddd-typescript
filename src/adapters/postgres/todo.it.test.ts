import { PGListsRepository } from "@src/adapters/postgres/todo";
import createTestDB, { TestDBContext } from "@src/adapters/postgres/test-utils";
import { NotFoundError } from "@src/domain/types/errors";

describe("PGListsRepository", () => {
  describe("create", () => {
    let dbCtx: TestDBContext;
    let repo: PGListsRepository;

    beforeAll(async () => {
      dbCtx = await createTestDB();
      repo = new PGListsRepository(dbCtx.knex);
    });

    afterAll(async () => {
      await dbCtx?.destroy();
    });

    test("should create and return a list", async () => {
      const l = await repo.create("travel");
      expect(l.id).toBeDefined();
      expect(l.name).toBe("travel");
      expect(l.createdAt).toBeDefined();
      expect(l.updatedAt).toBeDefined();
    });
  });

  describe("list", () => {
    let dbCtx: TestDBContext;
    let repo: PGListsRepository;

    beforeAll(async () => {
      dbCtx = await createTestDB();
      repo = new PGListsRepository(dbCtx.knex);
    });

    afterAll(async () => {
      await dbCtx?.destroy();
    });

    test("should and return an empty list when db is empty", async () => {
      const lists = await repo.list(50, 0);
      expect(lists).toStrictEqual([]);
    });

    test("should and return a list of todo-lists", async () => {
      const l1 = await repo.create("travel");
      const l2 = await repo.create("groceries");
      const l3 = await repo.create("shopping");
      const lists = await repo.list(50, 0);
      expect(lists.length).toBe(3);
      lists.forEach((l) => {
        expect([l1.name, l2.name, l3.name].includes(l.name));
        expect(l.id).toBeDefined();
        expect(l.createdAt).toBeDefined();
        expect(l.updatedAt).toBeDefined();
      });
    });
  });

  describe("addItem", () => {
    let dbCtx: TestDBContext;
    let repo: PGListsRepository;

    beforeAll(async () => {
      dbCtx = await createTestDB();
      repo = new PGListsRepository(dbCtx.knex);
    });

    afterAll(async () => {
      await dbCtx?.destroy();
    });

    test("should add an item to a list", async () => {
      const list = await repo.create("travel");
      const item = await repo.addItem(list.id, "tokyo");
      expect(item.name).toBe("tokyo");
      expect(item.listId).toBe(list.id);
      expect(item.id).toBeDefined();
      expect(item.createdAt).toBeDefined();
      expect(item.updatedAt).toBeDefined();
    });

    test("should throw an error if the list does not exist", async () => {
      const action = repo.addItem("unknown", "tokyo");
      await expect(action).rejects.toThrow(NotFoundError);
    });

    test("should throw an error on invalid name", async () => {
      const list = await repo.create("travel");
      // name > 100 chars is not allowed
      const name =
        "fndsfgertiwnfwoduwerjwenrdwhefwerhbwefsdfhiusbfrseuifgsdbfewhfgsdyfbsdhjgsdfbsbfjksdfhuierbsdfbshjcbsdusghfes";
      const action = repo.addItem(list.id, name);
      await expect(action).rejects.toThrow(Error);
    });
  });

  describe("getItems", () => {
    let dbCtx: TestDBContext;
    let repo: PGListsRepository;

    beforeAll(async () => {
      dbCtx = await createTestDB();
      repo = new PGListsRepository(dbCtx.knex);
    });

    afterAll(async () => {
      await dbCtx?.destroy();
    });

    test("should get items belonging to a list", async () => {
      const list = await repo.create("travel");
      const i1 = await repo.addItem(list.id, "tokyo");
      const i2 = await repo.addItem(list.id, "berlin");
      const i3 = await repo.addItem(list.id, "kolkata");
      const items = await repo.getItems(list.id, 50, 0);
      expect(items.length).toBe(3);
      items.forEach((i) => {
        expect([i1.name, i2.name, i3.name].includes(i.name));
        expect(i.id).toBeDefined();
        expect(i.createdAt).toBeDefined();
        expect(i.updatedAt).toBeDefined();
      });
    });

    test("should return an empty list if no items are present in a list", async () => {
      const list = await repo.create("groceries");
      const items = await repo.getItems(list.id, 50, 0);
      expect(items).toStrictEqual([]);
    });
  });

  describe("removeItem", () => {
    let dbCtx: TestDBContext;
    let repo: PGListsRepository;

    beforeAll(async () => {
      dbCtx = await createTestDB();
      repo = new PGListsRepository(dbCtx.knex);
    });

    afterAll(async () => {
      await dbCtx?.destroy();
    });

    test("should remove item belonging to a list", async () => {
      const list = await repo.create("travel");
      const i1 = await repo.addItem(list.id, "tokyo");
      const i2 = await repo.addItem(list.id, "berlin");
      const i3 = await repo.addItem(list.id, "kolkata");
      const items = await repo.getItems(list.id, 50, 0);
      expect(items.length).toBe(3);
      items.forEach((i) => {
        expect([i1.name, i2.name, i3.name].includes(i.name));
        expect(i.id).toBeDefined();
        expect(i.createdAt).toBeDefined();
        expect(i.updatedAt).toBeDefined();
      });
      const result = await repo.removeItem(i2.id);
      expect(result).toBe("success");
      const updatedItems = await repo.getItems(list.id, 50, 0);
      expect(updatedItems.length).toBe(2);
      items.forEach((i) => {
        expect([i1.name, i3.name].includes(i.name));
        expect(i.id).toBeDefined();
        expect(i.createdAt).toBeDefined();
        expect(i.updatedAt).toBeDefined();
      });
    });
  });
});
