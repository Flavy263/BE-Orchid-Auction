const express = require("express");
const passport = require("passport");
const auctionController = require("../controllers/auctionController");
const auctionMemberController = require("../controllers/auctionMemberController");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", authenticateJWT, auctionController.getAllAuction);
router.post("/", authenticateJWT, auctionController.createAuction);
router.get("/:auctionId", authenticateJWT, auctionController.getAuctionByID);
router.put("/:auctionId", authenticateJWT, auctionController.updateAuctionByID);
router.delete("/:auctionId", authenticateJWT, auctionController.deleteAuctionByID);
router.post("/saveMember", authenticateJWT, auctionMemberController.saveAuctionMember);

module.exports = router;
