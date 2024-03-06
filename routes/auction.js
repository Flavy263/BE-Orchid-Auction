const express = require("express");
const passport = require("passport");
const auctionController = require("../controllers/auctionController");
const auctionMemberController = require("../controllers/auctionMemberController");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", authenticateJWT, auctionController.getAllAuction);
router.post("/", authenticateJWT, auctionController.createAuction);
router.get(
  "/not-yet/:host_id",
  authenticateJWT,
  auctionController.getAuctionNotYetAuctionedByUser
);
router.get(
  "/about-to/:host_id",
  authenticateJWT,
  auctionController.getAuctionAboutToAuctionByUser
);
router.get(
  "/auctioning/:host_id",
  authenticateJWT,
  auctionController.getAuctionAuctioningByUser
);
router.get(
  "/autioned/:host_id",
  authenticateJWT,
  auctionController.getAuctionaAuctionedByUser
);
router.get("/:auctionId", authenticateJWT, auctionController.getAuctionByID);
router.put("/:auctionId", authenticateJWT, auctionController.updateAuctionByID);
router.delete(
  "/:auctionId",
  authenticateJWT,
  auctionController.deleteAuctionByID
);
router.post(
  "/saveMember",
  authenticateJWT,
  auctionMemberController.saveAuctionMember
);

module.exports = router;
