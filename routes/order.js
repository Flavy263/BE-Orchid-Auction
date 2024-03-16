const path = require("path");
const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();
const passport = require("passport");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/", authenticateJWT, orderController.getOrders);

module.exports = router;
