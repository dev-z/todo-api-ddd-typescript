import createLogger from "@src/utils/logger";
import { ListsRepository, List } from "@src/domain/types/todo";

export interface Dependencies {
  listsRepo: ListsRepository;
}

export type Input = {
  count: number;
  offset: number;
  metadata: {
    requestId: string;
    actor: string;
  };
};

export type ListLists = (input: Input) => Promise<List[]>;

export default function createListListsAction(deps: Dependencies): ListLists {
  const logger = createLogger("list-lists");
  return async (input: Input) => {
    const { count, offset, metadata } = input;
    try {
      const lists = await deps.listsRepo.list(count, offset);
      logger.info("lists fetched sucessfully", {
        actor: metadata.actor,
        count,
        offset,
      });
      return lists;
    } catch (listRepoErr) {
      logger.error("failed to fetch lists", {
        actor: metadata.actor,
        err: (<Error>listRepoErr).message,
        count,
        offset,
      });
      throw listRepoErr;
    }
  };
}
