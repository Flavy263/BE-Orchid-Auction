const path = require("path");
const express = require("express");
const walletController = require("../controllers/walletController");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", authenticateJWT, walletController.getWallet);
router.post("/", authenticateJWT, walletController.createWallet);
router.post("/deposit", authenticateJWT, walletController.addMoney);
router.post("/withdraw", authenticateJWT, walletController.withdrawMoney);
router.get("/:walletId", authenticateJWT, walletController.getWalletByID);
router.put("/:walletId", authenticateJWT, walletController.updateWalletByID);

module.exports = router;
