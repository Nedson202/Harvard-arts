import redis from 'redis';
import { logger } from '../';

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (err) => {
  logger.info(`Something went wrong: ${err}`);
});

export const addDataToRedis = (key: string, value: string) => {
  redisClient.set(key, JSON.stringify(value), (err) => {
    if (err) {
      throw err;
    }
    logger.info('Data added to redis store');
  });
};

// eslint-disable-next-line no-return-await
export const getDataFromRedis = async (key: string) => new Promise((resolve, reject) => {
  redisClient.get(key, (err, result) => {
    if (err) {
      reject(err);
    }
    resolve(JSON.parse(result));
  });
});

export default redisClient;
