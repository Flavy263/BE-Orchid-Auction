const express = require("express");
const passport = require("passport");
const productController = require("../controllers/productController");

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
// method get
router.get("/", productController.getAllProduct);
// method post
router.post("/", authenticateJWT, productController.postAddProduct);
// method put update product
router.put("/:productId", authenticateJWT, productController.putUpdateProduct);
// method delete product
router.delete("/:productId", authenticateJWT, productController.deleteProduct);



// router.post("/register", userController.postAddUser);

// router.post("/login", userController.postLoginUser);

module.exports = router;
