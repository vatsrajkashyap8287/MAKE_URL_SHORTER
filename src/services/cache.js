const redisClient = require('../config/redis');

class CacheService {
  static async get(shortCode) {
    try {
      if (redisClient.status !== 'ready') {
        return null;
      }
      
      const cachedUrl = await redisClient.get(`url:${shortCode}`);
      return cachedUrl;
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  }

  static async set(shortCode, originalUrl, ttl = 3600) {
    try {
      if (redisClient.status !== 'ready') {
        return;
      }
      
      await redisClient.setex(`url:${shortCode}`, ttl, originalUrl);
    } catch (error) {
      console.error('Cache set error:', error.message);
    }
  }

  static async incrementClicks(shortCode) {
    try {
      if (redisClient.status !== 'ready') {
        return;
      }
      
      await redisClient.incr(`clicks:${shortCode}`);
    } catch (error) {
      console.error('Cache increment error:', error.message);
    }
  }
}

module.exports = CacheService;