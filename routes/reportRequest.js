const path = require("path");
const express = require("express");
const reportRequestController = require("../controllers/reportRequestController.js");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", reportRequestController.getAllReportRequest);

router.get(
  "/getRequest/:userId",
  authenticateJWT,
  reportRequestController.getAllReportRequestByUserId
);

router.get(
  "/getByRequestMoney",
  authenticateJWT,
  reportRequestController.getReportRequestMoney
);
router.get(
  "/getByRequestMoneyPaid",
  authenticateJWT,
  reportRequestController.getReportRequestMoneyPaid
);
router.get(
  "/getByRequestBan",
  authenticateJWT,
  reportRequestController.getReportRequestBan
);
router.get(
  "/getByRequestAlreadyBan",
  authenticateJWT,
  reportRequestController.getReportRequestAlreadyBan
);
router.post("/", authenticateJWT, reportRequestController.postAddReportRequest);
router.get(
  "/:walletRequestId",
  authenticateJWT,
  reportRequestController.getReportRequestById
);
router.put(
  "/:walletRequestId",
  authenticateJWT,
  reportRequestController.putUpdateReportRequest
);
router.delete(
  "/:walletRequestId",
  authenticateJWT,
  reportRequestController.deleteReportRequest
);

module.exports = router;
