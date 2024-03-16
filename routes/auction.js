const express = require("express");
const passport = require("passport");
const auctionController = require("../controllers/auctionController");
const auctionMemberController = require("../controllers/auctionMemberController");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", auctionController.getAllAuction);
router.post("/", authenticateJWT, auctionController.createAuction);
router.put("/", authenticateJWT, auctionController.createAuction);
router.get("/not", authenticateJWT, auctionController.getAuctionNotAuctioned);
router.get("/not-yet", auctionController.getAuctionNotYetAuctioned);
router.get("/about-to", auctionController.getAuctionAboutToAuction);
router.get("/auctioning", auctionController.getAuctionAuctioning);
router.get("/autioned", auctionController.getAuctionaAuctioned);

router.get(
  "/getAuctionCountToday",
  authenticateJWT,
  auctionController.getAuctionCountToday
);

router.get(
  "/getAuctionCountYesterday",
  authenticateJWT,
  auctionController.getAuctionCountYesterday
);

router.get(
  "/getAuctionCountTwodayAgo",
  authenticateJWT,
  auctionController.getAuctionCountTwodayAgo
);

router.get(
  "/getAverageAuctionMembersToday",
  authenticateJWT,
  auctionController.getAverageAuctionMembersToday
);

router.get(
  "/getAverageAuctionMembersYesterday",
  authenticateJWT,
  auctionController.getAverageAuctionMembersYesterday
);

router.get(
  "/getAverageAuctionMembersTwodayAgo",
  authenticateJWT,
  auctionController.getAverageAuctionMembersTwodayAgo
);

router.get("/AuctionCount", auctionController.getAuctionCount);
router.get("/AboutToAuctionCount", auctionController.getAboutToAuctionCount);
router.get(
  "/AuctioningAuctionCount",
  auctionController.getAuctioningAuctionCount
);
router.get("/NotYetAuctionCount", auctionController.getNotYetAuctionCount);
router.get(
  "/AuctionedAuctionCount",
  auctionController.getAuctionedAuctionCount
);

router.get("/:host_id", authenticateJWT, auctionController.getAuctionByUserId);

router.get(
  "/not/:host_id",
  authenticateJWT,
  auctionController.getAuctionNotAuctionedByUser
);

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

router.get("/", authenticateJWT, auctionController.getAllAuction);

router.get(
  "/auctionBid/:auctionId/:customerId",
  auctionController.checkUserInAuction
);

router.post("/createOrder", authenticateJWT, auctionController.createOrder);
router.put(
  "/updateOrder/:orderId",
  authenticateJWT,
  auctionController.updateOrder
);

router.get(
  "/getOrder/:memberId",
  authenticateJWT,
  auctionController.getOrderByMemberID
);
router.get(
  "/getOrder/:hostId",
  authenticateJWT,
  auctionController.getOrderByHostID
);
router.get(
  "/checkAuctionParticipation/:auctionId/:memberId",
  authenticateJWT,
  auctionController.checkAuctionParticipation
);

router.get(
  "/memberAuctions-not-yet/:memberId",
  authenticateJWT,
  auctionController.getMemberAuctionNotYet
);

router.get(
  "/memberAuctions-about-to/:memberId",
  authenticateJWT,
  auctionController.getMemberAuctionAboutTo
);

router.get(
  "/memberAuctions-auctioning/:memberId",
  authenticateJWT,
  auctionController.getMemberAuctionAuctioning
);

router.get(
  "/memberAuctions-auctioned/:memberId",
  authenticateJWT,
  auctionController.getMemberAuctionAuctioned
);

router.get(
  "/getMostPriceInAuctionBid/:auctionId",
  auctionController.getMostPriceInAuctionBid
);

router.get("/AuctionToday/:date", auctionController.getAuctionsCreatedToday);

router.get(
  "/getAllMemberInAuctionBid/:auctionId",
  auctionController.getAllMemberInAuctionBid
);

// router.get(
//   "/AuctionToday",
//   authenticateJWT,
//   auctionController.getMostPriceInAuctionBid
// );

module.exports = router;
