const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const { verifyToken } = require("../authenticate");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const config = require("../config");

// Cấu hình cloudinary với biến môi trường từ config.js
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Cấu hình multer và cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: config.CLOUDINARY_FOLDER_USER_IMAGE, // Thư mục lưu trữ trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), userController.uploadImg);

router.get("/", authenticateJWT, userController.getAllUser);
router.post("/SendMailOTP", userController.sendMailOTP);
router.post("/AddOTP", userController.postAddOTP);
router.get("/", authenticateJWT, userController.getAllUser);
router.get("/GetAllOTP", userController.getAllOTP);
router.post("/CheckOTP", userController.checkOTP);

router.get("/MemberCount", authenticateJWT, userController.getMemberCount);
router.get("/HostCount", authenticateJWT, userController.getHostCount);
router.get(
  "/AgvMemberAuction",
  authenticateJWT,
  userController.getAgvMemberAuction
);

router.post("/login", userController.postLoginUser);

router.post("/register", upload.single("image"), userController.postAddUser);


router.get(
  "/getMemberCountToday",
  authenticateJWT,
  userController.getMemberCountToday
);

router.get(
  "/getHostCountToday",
  authenticateJWT,
  userController.getHostCountToday
);

router.get(
  "/getMemberCountYesterday",
  authenticateJWT,
  userController.getMemberCountYesterday
);

router.get(
  "/getHostCountYesterday",
  authenticateJWT,
  userController.getHostCountYesterday
);

router.get(
  "/getMemberCountTwodayAgo",
  authenticateJWT,
  userController.getMemberCountTwodayAgo
);

router.get(
  "/getHostCountTwodayAgo",
  authenticateJWT,
  userController.getHostCountTwodayAgo
);

router.get("/userid/:userid", userController.getUserById);

router.get("/username/:userName", userController.getUserByUsername);

router.get("/role/:roleId", userController.getUserByRole);
router.put("/update-user/:userId", authenticateJWT, userController.updateUserByID);
router.put("/ban-user/:userId", authenticateJWT, userController.banUserByID);
router.get("/fetchMe", verifyToken, userController.fetchMe);
module.exports = router;
