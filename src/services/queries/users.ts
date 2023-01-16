import { getUsernamesKey, getUsernamesUniqueKey, getUsersKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {
  const decimalId = await client.zScore(getUsernamesKey(), username);

  if (!decimalId) throw new Error('User does not exist');

  const id = decimalId.toString(16);

  const user = await client.hGetAll(getUsersKey(id));

  return deserialize(id, user);
};

export const getUserById = async (id: string) => {
  const user = await client.hGetAll(getUsersKey(id));

  return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
  const id = genId();

  const isUsernameInUse = await client.sIsMember(getUsernamesUniqueKey(), attrs.username);

  if (isUsernameInUse) throw new Error(`Username is taken`);

  await client.hSet(getUsersKey(id), serialize(attrs));
  await client.sAdd(getUsernamesUniqueKey(), attrs.username);
  await client.zAdd(getUsernamesKey(), {
    value: attrs.username,
    score: parseInt(id, 16)
  });

  return id;
};

const serialize = (user: CreateUserAttrs) => ({
  username: user.username,
  password: user.password
});

const deserialize = (id: string, user: { [key: string]: string }) => ({
  id,
  username: user.username,
  password: user.password
});