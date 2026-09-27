// Load dotenv
require('dotenv').config();

// DEBUGGING - Print all environment variables
console.log('=== DEBUGGING ENVIRONMENT VARIABLES ===');
console.log('Working Directory:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('PORT:', process.env.PORT);
console.log('======================================\n');

// If MONGODB_URI is undefined, stop here
if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is undefined!');
  console.error('.env file is not loading properly\n');
  
  console.log('Troubleshooting steps:');
  console.log('1. Check if .env file exists in:', process.cwd());
  console.log('2. Check if .env has this line: MONGODB_URI=mongodb://127.0.0.1:27017/url-shortener');
  console.log('3. Make sure there are NO SPACES around =');
  console.log('4. File should be named exactly ".env" (not .env.txt)');
  process.exit(1);
}

const connectDB = require('./src/config/database');
const redisClient = require('./src/config/redis');

const testConnections = async () => {
  console.log('Testing Database Connections...\n');
  
  try {
    await connectDB();
    console.log('MongoDB test passed\n');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Redis Status:', redisClient.status);
  } catch (error) {
    console.error('Redis connection error:', error.message);
  }

  process.exit(0);
};

testConnections();