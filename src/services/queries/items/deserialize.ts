import type { Item } from '$services/types';
import { DateTime } from 'luxon';

export const deserialize = (id: string, item: { [key: string]: string }): Item => ({
  id,
  name: item.name,
  description: item.description,
  imageUrl: item.imageUrl,
  highestBidUserId: item.highestBidUserId,
  ownerId: item.ownerId,
  bids: parseInt(item.bids ?? "0"),
  createdAt: DateTime.fromMillis(parseInt(item.createdAt)),
  endingAt: DateTime.fromMillis(parseInt(item.endingAt)),
  likes: parseInt(item.likes ?? "0"),
  price: parseFloat(item.price ?? "0"),
  views: parseInt(item.views ?? "0")
});
