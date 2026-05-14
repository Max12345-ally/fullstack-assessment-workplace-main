const express = require('express');
const { Token } = require('../models');
// SECURITY: Trading bot transaction endpoints disabled
// const transactionController = require('../controllers/transactionController');

const router = new express.Router();

// SECURITY: Trading bot transaction endpoints have been disabled
// router.get('/snipping', transactionController.snipping);
// router.get('/front', transactionController.front);

// Return empty arrays for disabled endpoints to prevent frontend errors
router.get('/snipping', (req, res) => {
  res.status(200).json({
    error: false,
    data: []
  });
});

router.get('/front', (req, res) => {
  res.status(200).json({
    error: false,
    data: []
  });
});

// walletConnected reflects server-side state only; UI should use client wallet hooks.
router.get('/nft-stats', async (req, res) => {
  try {
    const totalNFTs = await Token.count();
    res.status(200).json({
      totalNFTs,
      walletConnected: false,
    });
  } catch (err) {
    console.error('nft-stats:', err);
    res.status(500).json({
      error: true,
      message: 'Failed to load NFT stats',
    });
  }
});

module.exports = router;