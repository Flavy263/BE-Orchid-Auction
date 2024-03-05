const path = require("path");
const express = require("express");
const walletHistoryController = require("../controllers/walletHistoryController");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

// router.get("/", authenticateJWT, walletHistoryController.getWalletHistory);
// router.post("/", authenticateJWT, walletHistoryController.createWalletHistory);
// router.get("/:walletId", authenticateJWT, walletHistoryController.getWalletHistoryByID);
// router.put("/:walletId", authenticateJWT, walletHistoryController.updateWalletHistoryByID);
// router.delete("/:walletId", authenticateJWT, walletHistoryController.deleteWalletHistoryByID);

module.exports = router;
