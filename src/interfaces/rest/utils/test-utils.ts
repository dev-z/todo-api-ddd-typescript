import { Handler, Context } from "aws-lambda";

export async function invoke<E, R>(
  handler: Handler<E, R>,
  event: Partial<E>
): Promise<R> {
  const context = {} as Context;
  const res = await (handler(event as E, context, () => ({})) as Promise<R>);
  return res;
}
