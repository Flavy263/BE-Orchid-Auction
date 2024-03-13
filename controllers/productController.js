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
  Product.find({}).populate("host_id")
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


exports.getProductsCreatedToday = async (req, res) => {
  try {
    const requestedDate = new Date(req.params.date);
    const startOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
    const endOfDay = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate() + 1);

    // Sử dụng Mongoose để đếm số lượng sản phẩm được tạo trong ngày cụ thể
    const productCount = await Product.countDocuments({
      timestamp: { $gte: startOfDay, $lt: endOfDay }
    }).exec();

    res.json({ productCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

exports.postAddProduct = async (req, res) => {
  try {
    // Kiểm tra xem có file ảnh và video được tải lên hay không
    if (!req.files || !req.files["image"] || !req.files["video"]) {
      return res.status(400).json({ error: "No image or video uploaded." });
    }
    
    // Sử dụng thông tin từ đối tượng result trực tiếp
    const imageUrls = req.files["image"].map((image) => image.path);
    const videoUrls = req.files["video"].map((video) => video.path);

    // Tạo một đối tượng Product mới
    const newProduct = new Product({
      name: req.body.name,
      image: imageUrls,
      video: videoUrls,
      description: req.body.description,
      host_id: req.body.host_id,
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    const savedProduct = await newProduct.save();

    // In ra thông tin sản phẩm sau khi đăng ký thành công
    console.log("Product created:", savedProduct);

    res
      .status(200)
      .json({ success: true, status: "Product created successfully!" });
  } catch (error) {
    console.error("Error uploading image or video:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
