const express = require('express');
const { param } = require('express-validator');
const Url = require('../models/Url');
const CacheService = require('../services/cache');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// GET /:shortCode - Redirect to original URL
router.get('/:shortCode',
  [
    param('shortCode')
      .isLength({ min: 6, max: 10 })
      .withMessage('Invalid short code format')
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { shortCode } = req.params;

      console.log('Redirect request for:', shortCode);

      // Try cache first
      let originalUrl = await CacheService.get(shortCode);

      if (!originalUrl) {
        console.log('Cache miss - querying database');
        
        // Cache miss - query database
        const url = await Url.findOne({ shortCode });
        
        if (!url) {
          console.log('URL not found in database');
          return res.status(404).json({
            success: false,
            message: 'Short URL not found'
          });
        }

        originalUrl = url.originalUrl;

        // Update cache
        await CacheService.set(shortCode, originalUrl);

        // Increment clicks in database
        url.clicks += 1;
        await url.save();
        
        console.log('Redirecting to:', originalUrl);
      } else {
        console.log('Cache hit - redirecting to:', originalUrl);
      }

      // Increment clicks in cache (async, non-blocking)
      CacheService.incrementClicks(shortCode);

      // Redirect
      res.redirect(originalUrl);

    } catch (error) {
      console.error('Redirect error:', error);
      next(error);
    }
  }
);

module.exports = router;