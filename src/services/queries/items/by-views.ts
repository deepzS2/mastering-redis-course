import { getItemsByViewsKey, getItemsKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
  let results = await client.sort(
    getItemsByViewsKey(),
    {
      GET: [
        '#',
        `${getItemsKey('*')}->name`,
        `${getItemsKey('*')}->views`,
        `${getItemsKey('*')}->endingAt`,
        `${getItemsKey('*')}->imageUrl`,
        `${getItemsKey('*')}->price`,
      ],
      BY: 'nosort',
      DIRECTION: order,
      LIMIT: {
        count,
        offset,
      }
    }
  ) as string[]

  const items = [];

  while (results.length) {
    const [id, name, views, endingAt, imageUrl, price, ...rest] = results
    const item = deserialize(id, { name, views, endingAt, imageUrl, price })
    items.push(item)
    results = rest
  }
  
  return items
};
