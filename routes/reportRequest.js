const path = require("path");
const express = require("express");
const reportRequestController = require("../controllers/reportRequestController.js");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", reportRequestController.getAllWalletRequest);
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
router.post("/", authenticateJWT, reportRequestController.postAddWalletRequest);
router.get(
  "/:walletRequestId",
  authenticateJWT,
  reportRequestController.getWalletRequestById
);
router.put(
  "/:walletRequestId",
  authenticateJWT,
  reportRequestController.putUpdateWalletRequest
);
router.delete(
  "/:walletRequestId",
  authenticateJWT,
  reportRequestController.deleteWalletRequest
);

module.exports = router;
