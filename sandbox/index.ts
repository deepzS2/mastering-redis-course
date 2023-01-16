import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
  await client.hSet('car1', {
    color: 'red',
    yeara: 1950
  })

  await client.hSet('car2', {
    color: 'green',
    yeara: 1955
  })

  await client.hSet('car3', {
    color: 'blue',
    yeara: 1960
  })

  const results = await Promise.all([
    client.hGetAll('car1'),
    client.hGetAll('car2'),
    client.hGetAll('car3')
  ])

  console.log(results)
};
run();
