const express = require('express');
const { body, param } = require('express-validator');
const Url = require('../models/Url');
const Encoder = require('../services/encoder');
const CacheService = require('../services/cache');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// POST /api/shorten - Create short URL
router.post('/shorten', 
  [
    body('originalUrl')
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Please provide a valid URL')
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { originalUrl } = req.body;

      // Check if URL already exists
      let url = await Url.findOne({ originalUrl });
      
      if (url) {
        return res.json({
          success: true,
          data: {
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${url.shortCode}`,
            clicks: url.clicks
          }
        });
      }

      // Generate unique short code
      let shortCode;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        shortCode = Encoder.generateShortCode();
        const exists = await Url.findOne({ shortCode });
        
        if (!exists) break;
        
        attempts++;
        if (attempts === maxAttempts) {
          throw new Error('Failed to generate unique short code');
        }
      }

      // Create new URL
      url = await Url.create({
        originalUrl,
        shortCode
      });

      // Cache it
      await CacheService.set(shortCode, originalUrl);

      res.status(201).json({
        success: true,
        data: {
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${url.shortCode}`,
          createdAt: url.createdAt
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

// GET /api/analytics/:shortCode - Get analytics
router.get('/analytics/:shortCode',
  [
    param('shortCode')
      .isLength({ min: 6, max: 10 })
      .isAlphanumeric()
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { shortCode } = req.params;

      const url = await Url.findOne({ shortCode });

      if (!url) {
        return res.status(404).json({
          success: false,
          message: 'URL not found'
        });
      }

      res.json({
        success: true,
        data: {
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${url.shortCode}`,
          clicks: url.clicks,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;