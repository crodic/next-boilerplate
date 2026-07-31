import { Redis } from 'ioredis';
import { env } from '@/env';

const globalForRedis = global as unknown as { redis: Redis };

export const redisClientSingleton = () => {
  return new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  });
};

export const redis = globalForRedis.redis ?? redisClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export default redis;
