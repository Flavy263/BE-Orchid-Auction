const express = require("express");
const passport = require("passport");
const productController = require("../controllers/productController");

const router = express.Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// const config = require('../config');

// // Cấu hình cloudinary với biến môi trường từ config.js
// cloudinary.config({
//     cloud_name: config.CLOUDINARY_CLOUD_NAME,
//     api_key: config.CLOUDINARY_API_KEY,
//     api_secret: config.CLOUDINARY_API_SECRET,
// });

// // Cấu hình multer và cloudinary storage
// const storage = multer.memoryStorage();
// const videoFileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('video/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only video files are allowed.'), false);
//     }
// };
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('../config'); // Import file chứa thông tin cấu hình

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: config.CLOUDINARY_FOLDER_PRODUCT_VIDEO, // Thư mục lưu trữ trên Cloudinary cho video
        resource_type: 'video',
    },
});

const uploadVideo = multer({ storage: storage });
router.post('/uploadVideo', uploadVideo.single('video'), productController.uploadVideo);
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
