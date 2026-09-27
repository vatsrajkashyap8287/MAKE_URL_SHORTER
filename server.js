const express = require('express');
const config = require('./config');
const connectDB = require('./src/config/database');
const redisClient = require('./src/config/redis');
const urlRoutes = require('./src/routes/url.routes');       // ← Correct path
const redirectRoutes = require('./src/routes/redirect.routes'); // ← Correct path
const errorHandler = require('./src/utils/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mongodb: 'connected',
    redis: redisClient.status || 'not connected',
    timestamp: new Date().toISOString()
  });
});

// API routes (with /api prefix)
app.use('/api', urlRoutes);

// Redirect routes (without prefix)
app.use('/', redirectRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.PORT;

const startServer = async () => {
  try {
    await connectDB();
    
    try {
      if (redisClient.status === 'wait') {
        await redisClient.connect();
      }
    } catch (redisError) {
      console.log('⚠️  Redis: Running without cache');
    }
    
    app.listen(PORT, () => {
      console.log(`\nServer running on port ${PORT}`);
      console.log(`MongoDB: Connected`);
      console.log(`Redis: ${redisClient.status || 'disabled'}`);
      console.log(`\nAPI Endpoints:`);
      console.log(`   Health:    GET  http://localhost:${PORT}/health`);
      console.log(`   Shorten:   POST http://localhost:${PORT}/api/shorten`);
      console.log(`   Redirect:  GET  http://localhost:${PORT}/:shortCode`);
      console.log(`   Analytics: GET  http://localhost:${PORT}/api/analytics/:shortCode\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();