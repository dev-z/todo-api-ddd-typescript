import createLogger from "@src/utils/logger";
import { ListsRepository, Item } from "@src/domain/types/todo";

export interface Dependencies {
  listsRepo: ListsRepository;
}

export type Input = {
  listId: string;
  name: string;
  metadata: {
    requestId: string;
    actor: string;
  };
};

export type AddItem = (input: Input) => Promise<Item>;

export default function createAddItemAction(deps: Dependencies): AddItem {
  const logger = createLogger("add-item");
  return async (input: Input) => {
    const { listId, name, metadata } = input;
    try {
      const item = await deps.listsRepo.addItem(listId, name);
      logger.info("item added sucessfully", {
        actor: metadata.actor,
        listId,
        name,
      });
      return item;
    } catch (listRepoErr) {
      logger.error("failed to add item", {
        actor: metadata.actor,
        err: (<Error>listRepoErr).message,
        listId,
        name,
      });
      throw listRepoErr;
    }
  };
}
