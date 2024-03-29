const express = require("express");
const passport = require("passport");
const auctionBidController = require("../controllers/auctionBidController");

const router = express.Router();

// Define endpoint to handle new bid
router.post('/:auctionId/:customerId/new-bid', auctionBidController.handleNewBid);

router.get('/auctionBid/:auctionId', auctionBidController.handleFindMaxPrice)
router.get('/auctionBid-sortDes/:auctionId', auctionBidController.getAuctionBidSortDes)
router.get('/getMemberDoNotBid/:auctionId', auctionBidController.getMemberDoNotBid)
router.get('/getAuctionHaveMemberDoNotBid/:host_id', auctionBidController.getAuctionHaveMemberDoNotBid)
router.get('/getUnregisteredAuction/:host_id', auctionBidController.getUnregisteredAuction)
module.exports = router;
