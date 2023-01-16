import { getItemsKey, getUserLikeKey } from "$services/keys";
import { client } from "$services/redis";
import { getItems } from "./items";

export const userLikesItem = async (itemId: string, userId: string) => {
  return client.sIsMember(getUserLikeKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
  const ids = await client.sMembers(getUserLikeKey(userId));

  return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
  const inserted = await client.sAdd(getUserLikeKey(userId), itemId);

  if (inserted) {
    return await client.hIncrBy(getItemsKey(itemId), 'likes', 1);
  }
};

export const unlikeItem = async (itemId: string, userId: string) => {
  const removed = await client.sRem(getUserLikeKey(userId), itemId);

  if (removed) {
    return await client.hIncrBy(getItemsKey(itemId), 'likes', -1);
  }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
  const ids = await client.sInter([getUserLikeKey(userOneId), getUserLikeKey(userTwoId)]);

  return getItems(ids);
};
