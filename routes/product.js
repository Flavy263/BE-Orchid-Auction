const express = require("express");
const passport = require("passport");
const productController = require("../controllers/productController");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const config = require("../config"); // Import file chứa thông tin cấu hình

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const storageVideo = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: config.CLOUDINARY_FOLDER_PRODUCT,
    resource_type: "video",
  },
});
const uploadVideo = multer({ storage: storageVideo });

// Cấu hình multer và cloudinary storage
const storageImgAndVideo = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: config.CLOUDINARY_FOLDER_PRODUCT,
    resource_type: "auto",
  },
});
const uploadImgAndVideo = multer({ storage: storageImgAndVideo });

router.post(
  "/addProduct",
  authenticateJWT,
  uploadImgAndVideo.fields([
    { name: "image", maxCount: 5 },
    { name: "video", maxCount: 5 },
  ]),
  productController.postAddProduct
);

router.post(
  "/uploadVideo",
  uploadVideo.single("video"),
  productController.uploadVideo
);

router.get(
  "/getProductCountToday",
  authenticateJWT,
  productController.getProductCountToday
);

router.get(
  "/getProductCountYesterday",
  authenticateJWT,
  productController.getProductCountYesterday
);

router.get(
  "/getProductCountTwodayAgo",
  authenticateJWT,
  productController.getProductCountTwodayAgo
);

// method get
router.get("/", productController.getAllProduct);

router.get("/ProductToday/:date", productController.getProductsCreatedToday);

router.get("/:userId", authenticateJWT, productController.getProductByUserID);

// method post
router.post("/", authenticateJWT, productController.postAddProduct);

// method put update product
router.put("/:productId", authenticateJWT, productController.putUpdateProduct);
// method delete product
router.delete("/:productId", authenticateJWT, productController.deleteProduct);

// router.post("/register", userController.postAddUser);

// router.post("/login", userController.postLoginUser);

module.exports = router;
