const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const { verifyToken } = require("../authenticate");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

// router.use(authenticateJWT);
// router.use((req, res, next) => {
//   if (req.path === '/') {
//     authenticateJWT(req, res, next);
//   } else {
//     next();
//   }
// });

router.get("/", authenticateJWT, userController.getAllUser);

router.get("/fetchMe", verifyToken, userController.fetchMe);

router.post("/register", userController.postAddUser);

router.post("/login", userController.postLoginUser);

module.exports = router;