import { getItemsByEndingAtKey, getItemsByPriceKey, getItemsByViewsKey, getItemsKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { deserialize } from './deserialize';
import { serialize } from './serialize';

export const getItem = async (id: string) => {
  const item = await client.hGetAll(getItemsKey(id));

  if (Object.keys(item).length === 0) {
    return null;
  }

  return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
  const commands = ids.map((id) => client.hGetAll(getItemsKey(id)));

  const results = await Promise.all(commands);

  return results.map((result, i) => {
    if (Object.keys(result).length === 0) {
      return null;
    }

    return deserialize(ids[i], result);
  })
};

export const createItem = async (attrs: CreateItemAttrs) => {
  const id = genId();

  const serialized = serialize(attrs);

  await Promise.all([
    client.hSet(getItemsKey(id), serialized),
    client.zAdd(getItemsByViewsKey(), {
      value: id,
      score: 0
    }),
    client.zAdd(getItemsByEndingAtKey(), {
      value: id,
      score: serialized.endingAt
    }),
    client.zAdd(getItemsByPriceKey(), {
      value: id,
      score: 0,
    })
  ]);

  return id;
};
