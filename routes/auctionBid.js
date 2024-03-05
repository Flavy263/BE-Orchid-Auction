const express = require("express");
const passport = require("passport");
const auctionBidController = require("../controllers/auctionBidController");

const router = express.Router();

// Define endpoint to handle new bid
router.post('/auction/:auctionId/new-bid', auctionController.handleNewBid);
