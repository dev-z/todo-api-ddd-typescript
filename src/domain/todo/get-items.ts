import createLogger from "@src/utils/logger";
import { ListsRepository, Item } from "@src/domain/types/todo";
import { NotFoundError } from "@src/domain/types/errors";

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

export type GetItems = (input: Input) => Promise<Item[]>;

export default function createListListsAction(deps: Dependencies): GetItems {
  const logger = createLogger("get-items");
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
      if (listRepoErr instanceof NotFoundError) {
        logger.error("list not found", {
          actor: metadata.actor,
          err: (<Error>listRepoErr).message,
          listId,
        });
      } else {
        logger.error("failed to get items", {
          actor: metadata.actor,
          err: (<Error>listRepoErr).message,
          listId,
          count,
          offset,
        });
      }
      throw listRepoErr;
    }
  };
}
