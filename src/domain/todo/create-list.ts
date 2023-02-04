import createLogger from "@src/utils/logger";
import { ListsRepository, List } from "@src/domain/types/todo";

export interface Dependencies {
  listsRepo: ListsRepository;
}

export type Input = {
  name: string;
  metadata: {
    requestId: string;
    actor: string;
  };
};

export type CreateList = (input: Input) => Promise<List>;

export default function createCreateListAction(deps: Dependencies): CreateList {
  const logger = createLogger("create-list");
  return async (input: Input) => {
    const { name, metadata } = input;
    try {
      const list = await deps.listsRepo.create(name);
      logger.info("list created sucessfully", {
        actor: metadata.actor,
        name: name,
      });
      return list;
    } catch (listRepoErr) {
      logger.error("failed to create list", {
        actor: metadata.actor,
        err: (<Error>listRepoErr).message,
        name,
      });
      throw listRepoErr;
    }
  };
}
