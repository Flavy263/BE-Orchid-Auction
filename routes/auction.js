// routes.js

const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

// Define endpoint to handle new bid
router.post('/auction/:auctionId/new-bid', auctionController.handleNewBid);

module.exports = router;
