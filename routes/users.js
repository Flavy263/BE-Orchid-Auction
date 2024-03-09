const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const { verifyToken } = require("../authenticate");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const config = require('../config');

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
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single('image'), userController.uploadImg);

router.get("/", authenticateJWT, userController.getAllUser);

router.get("/fetchMe", verifyToken, userController.fetchMe);

router.post("/register", upload.single('image'), userController.postAddUser);

router.post("/login", userController.postLoginUser);

router.get("/userid/:userid", userController.getUserById);

router.get("/username/:userName", userController.getUserByUsername);

router.get("/role/:roleId", userController.getUserByRole);

router.post("/ban-user", authenticateJWT, userController.banUserByID);
module.exports = router;
