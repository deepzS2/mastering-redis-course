import { getSessionsKey } from '$services/keys';
import { client } from '$services/redis';
import type { Session } from '$services/types';

export const getSession = async (id: string) => {
  const session = await client.hGetAll(getSessionsKey(id));

  if (Object.keys(session).length === 0) {
    return null;
  }

  return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
  return await client.hSet(getSessionsKey(session.id), serialize(session));
};

const deserialize = (id: string, session: { [key: string]: string }) => ({
  id,
  userId: session.userId,
  username: session.username
});

const serialize = (session: Session) => ({
  userId: session.userId,
  username: session.username
})