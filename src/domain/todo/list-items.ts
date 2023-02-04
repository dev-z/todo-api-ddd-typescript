import createLogger from "@src/utils/logger";
import { ListsRepository, Item } from "@src/domain/types/todo";

export interface Dependencies {
  listsRepo: ListsRepository;
}

export type Input = {
  listId: string;
  count: number;
  offset: number;
  metadata: {
    requestId: string;
    actor: string;
  };
};

export type ListItems = (input: Input) => Promise<Item[]>;

export default function createListItemsAction(deps: Dependencies): ListItems {
  const logger = createLogger("list-items");
  return async (input: Input) => {
    const { listId, count, offset, metadata } = input;
    try {
      const items = await deps.listsRepo.getItems(listId, count, offset);
      logger.info("items fetched sucessfully", {
        actor: metadata.actor,
        listId,
        count,
        offset,
      });
      return items;
    } catch (listRepoErr) {
      logger.error("failed to get items", {
        actor: metadata.actor,
        err: (<Error>listRepoErr).message,
        listId,
        count,
        offset,
      });
      throw listRepoErr;
    }
  };
}
