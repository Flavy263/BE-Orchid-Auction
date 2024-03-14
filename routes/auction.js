const express = require("express");
const passport = require("passport");
const auctionController = require("../controllers/auctionController");
const auctionMemberController = require("../controllers/auctionMemberController");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", authenticateJWT, auctionController.getAllAuction);
router.post("/", authenticateJWT, auctionController.createAuction);
router.get(
  "/not-yet",
  authenticateJWT,
  auctionController.getAuctionNotYetAuctioned
);
router.get(
  "/about-to",
  authenticateJWT,
  auctionController.getAuctionAboutToAuction
);
router.get(
  "/auctioning",
  authenticateJWT,
  auctionController.getAuctionAuctioning
);
router.get(
  "/autioned",
  authenticateJWT,
  auctionController.getAuctionaAuctioned
);

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

router.get("/:host_id", authenticateJWT, auctionController.getAuctionByUserId);
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
  authenticateJWT,
  auctionController.getMostPriceInAuctionBid
);

router.get("/AuctionToday/:date", auctionController.getAuctionsCreatedToday);
// router.get(
//   "/AuctionToday",
//   authenticateJWT,
//   auctionController.getMostPriceInAuctionBid
// );


module.exports = router;
