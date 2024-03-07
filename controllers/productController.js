// crud product
const Product = require("../models/Product");
const Auctions = require("../models/Auction");

exports.uploadVideo = async (req, res) => {
  try {
    // Check if a video file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No video uploaded." });
    }

    // Use the information from the result object directly
    const videoUrl = req.file.path;

    // Return the URL of the video on Cloudinary
    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllProduct = (req, res, next) => {
  Product.find({})
    .then((products) => {
      if (!products || products.length === 0) {
        // Nếu không có sản phẩm nào thỏa mãn điều kiện, trả về thông báo hoặc mã lỗi
        const err = new Error("No active products found.");
        err.status = 404; // Mã lỗi 404 - Not Found
        throw err;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(products);
    })
    .catch((err) => next(err));
};

exports.getProductByUserID = (req, res, next) => {
  const userId = req.params.userId;
  Product.find({ host_id: userId })
    .then(
      (user) => {
        if (user) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        } else {
          res.statusCode = 404;
          res.end("Product not found");
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.postAddProduct = (req, res, next) => {
  // Check if there is an image file uploaded
  if (!req.files || (!req.files.image && !req.files.video)) {
    return res.status(400).json({ success: false, message: 'No image or video uploaded.' });
  }
  // console.log();
  // Initialize arrays to store image and video URLs
  const imageUrls = [];
  const videoUrls = [];
  // Process image files
  if (req.files.image) {
    for (const image of req.files.image) {
      imageUrls.push(image.path);
    }
  }
  // Process video files
  if (req.files.video) {
    for (const video of req.files.video) {
      videoUrls.push(video.path);
    }
  }
  // Create product
  Product.register(
    new User({
      name: req.body.username,
      image: imageUrls,
      video: videoUrls,
      description: req.body.description,
    }),
    (err, user) => {
      // console.log("req",req);
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        // passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, status: "Registration Product Successful!" });
        // });
      }
    }
  );
};

exports.putUpdateProduct = (req, res, next) => {
  Product.findByIdAndUpdate(
    req.params.productId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (product) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Update Successful!",
          product: product,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByIdAndUpdate(
    productId,
    { $set: { status: false } },
    { new: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        // Nếu không tìm thấy sản phẩm, trả về lỗi
        const err = new Error(`Product with ID ${productId} not found.`);
        err.status = 404;
        throw err;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "Update Successful!",
        updatedProduct: updatedProduct,
      });
    })
    .catch((err) => next(err));
};
