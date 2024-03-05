const path = require("path");
const express = require("express");
const walletRequestController = require("../controllers/walletRequestController.js");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", walletRequestController.getAllWalletRequest);
router.post("/", authenticateJWT, walletRequestController.postAddWalletRequest);
router.get("/:walletRequestId", authenticateJWT, walletRequestController.getWalletRequestById);
router.put("/:walletRequestId", authenticateJWT, walletRequestController.putUpdateWalletRequest);
router.delete("/:walletRequestId", authenticateJWT, walletRequestController.deleteWalletRequest);

module.exports = router;
