const path = require("path");
const express = require("express");
const walletController = require("../controllers/walletController");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", authenticateJWT, walletController.getWallet);
router.get("/getByUserId", authenticateJWT, walletController.getWalletByUserId);
router.post("/", authenticateJWT, walletController.createWallet);
router.post("/deposit", authenticateJWT, walletController.addMoney);
router.post("/browse-deposit", authenticateJWT, walletController.browseDeposit);
router.post("/withdraw", authenticateJWT, walletController.withdrawMoney);
router.post("/registerJoinInAuction", authenticateJWT, walletController.registerJoinInAuction);

router.get("/:walletId", authenticateJWT, walletController.getWalletByID);
router.put("/:walletId", authenticateJWT, walletController.updateWalletByID);

module.exports = router;
