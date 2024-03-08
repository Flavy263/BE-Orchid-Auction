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
router.put("/updateOrder/:orderId", authenticateJWT, auctionController.updateOrder);
router.get("/getOrder/:memberId", authenticateJWT, auctionController.getOrderByMemberID);
router.get("/getOrder/:hostId", authenticateJWT, auctionController.getOrderByHostID);

module.exports = router;
