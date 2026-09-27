require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url-shortener',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};