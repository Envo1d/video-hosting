import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', error => console.error('Redis connection error:', error.message))

export const connectRedis = async () => {
  await redisClient.connect()
  await redisClient.set('try', 'Hello Welcome to Express with TypeORM')
}

export default redisClient;
