// crud product
const Product = require("../models/Product");

exports.uploadVideo = async (req, res) => {
  try {
    // Check if a video file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No video uploaded.' });
    }

    // Use the information from the result object directly
    const videoUrl = req.file.path;

    // Return the URL of the video on Cloudinary
    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

const cloudinary = require('cloudinary').v2;
exports.postAddProduct = async (req, res) => {
  try {
    const image = req.files['image'][0];
    const video = req.files['video'][0];

    const CHUNK_SIZE = 1024; // Đặt kích thước phần nhỏ theo ý muốn

    const imageBuffer = image.buffer;
    const videoBuffer = video.buffer;

    const imageChunks = [];
    const videoChunks = [];

    for (let i = 0; i < imageBuffer.length; i += CHUNK_SIZE) {
      imageChunks.push(imageBuffer.slice(i, i + CHUNK_SIZE));
    }

    for (let i = 0; i < videoBuffer.length; i += CHUNK_SIZE) {
      videoChunks.push(videoBuffer.slice(i, i + CHUNK_SIZE));
    }

    const imageResults = await Promise.all(
      imageChunks.map((chunk) =>
        cloudinary.uploader.upload(chunk.toString('base64'), {
          folder: 'uploads',
          resource_type: 'image',
        })
      )
    );

    const videoResults = await Promise.all(
      videoChunks.map((chunk) =>
        cloudinary.uploader.upload(chunk.toString('base64'), {
          folder: 'uploads',
          resource_type: 'video',
        })
      )
    );


    res.status(200).json({ imageUrl: imageResults.secure_url, videoUrl: videoResults.secure_url });

  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
