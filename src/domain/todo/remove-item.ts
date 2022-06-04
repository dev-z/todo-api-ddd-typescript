import createLogger from "@src/utils/logger";
import { ListsRepository } from "@src/domain/types/todo";
import { NotFoundError } from "@src/domain/types/errors";

export interface Dependencies {
  listsRepo: ListsRepository;
}

export type Input = {
  id: string;
  metadata: {
    requestId: string;
    actor: string;
  };
};

export type RemoveItem = (input: Input) => Promise<string>;

export default function createRemoveItemAction(deps: Dependencies): RemoveItem {
  const logger = createLogger("remove-item");
  return async (input: Input) => {
    const { id, metadata } = input;
    try {
      const status = await deps.listsRepo.removeItem(id);
      logger.info("item removed sucessfully", {
        actor: metadata.actor,
        id,
      });
      return status;
    } catch (listRepoErr) {
      if (listRepoErr instanceof NotFoundError) {
        logger.error("not found", {
          actor: metadata.actor,
          err: (<Error>listRepoErr).message,
          id,
        });
      } else {
        logger.error("failed to remove item", {
          actor: metadata.actor,
          err: (<Error>listRepoErr).message,
          id,
        });
      }
      throw listRepoErr;
    }
  };
}
