const path = require("path");
const express = require("express");
const reportRequestController = require("../controllers/reportRequestController.js");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", reportRequestController.getAllWalletRequest);
router.get("/getByRequestType", reportRequestController.getReportRequestsByType);
router.post("/", authenticateJWT, reportRequestController.postAddWalletRequest);
router.get("/:walletRequestId", authenticateJWT, reportRequestController.getWalletRequestById);
router.put("/:walletRequestId", authenticateJWT, reportRequestController.putUpdateWalletRequest);
router.delete("/:walletRequestId", authenticateJWT, reportRequestController.deleteWalletRequest);

module.exports = router;
