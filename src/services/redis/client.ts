import { getItemsByViewsKey, getItemsKey, getItemsViewsKey } from '$services/keys';
import { createClient, defineScript } from 'redis';
import { createIndexes } from './create-indexes';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
  scripts: {
    unlock: defineScript({
      NUMBER_OF_KEYS: 1,
      SCRIPT: `
        if redis.call('GET', KEYS[1]) == ARGV[1] then
          return redis.call('DEL', KEYS[1])
        end
      `,
      transformArguments(key: string, token: string) {
        return [key, token];
      },
      transformReply(reply: any) {
        return reply;
      }
    }),
    addOneAndStore: defineScript({
      NUMBER_OF_KEYS: 1,
      SCRIPT: `
        return redis.call('SET', KEYS[1], 1 + tonumber(ARGV[1]))
      `,
      transformArguments(key: string, value: number) {
        return [key, value.toString()];
      },
      transformReply(reply: any) {
        return reply;
      }
    }),
    incrementViews: defineScript({
      NUMBER_OF_KEYS: 3,
      SCRIPT: `
        local itemsViewsKey = KEYS[1]
        local itemsKey = KEYS[2]
        local itemsByViewsKey = KEYS[3]
        local itemId = ARGV[1]
        local userId = ARGV[2]

        local inserted = redis.call('PFADD', itemsViewsKey, userId)

        if inserted == 1 then
          redis.call('HINCRBY', itemsKey, 'views', 1)
          redis.call('ZINCRBY', itemsByViewsKey, 1, itemId)
        end
      `,
      transformArguments(itemId: string, userId: string) {
        return [
          getItemsViewsKey(itemId),
          getItemsKey(itemId),
          getItemsByViewsKey(),
          itemId,
          userId
        ]
      },
      transformReply() {}
    })
  }
});

client.on('connect', async () => {
  try {
    await createIndexes();
  } catch (error) {
    console.error(error); 
  }
})
client.on('error', (err) => console.error(err));

client.connect();

export { client };