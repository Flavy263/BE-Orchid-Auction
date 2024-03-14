const User = require("../models/User");
const Wallet = require("../models/Wallet");
const passport = require("passport");
const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");
const ReportRequest = require("../models/Report_Request");
const Role = require("../models/Role");
const Auction = require("../models/Auction");

exports.uploadImg = async (req, res) => {
  try {
    // Kiểm tra xem có file ảnh được tải lên hay không
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    // Sử dụng thông tin từ đối tượng result trực tiếp
    const imageUrl = req.file.path;

    // Trả về URL của ảnh trên Cloudinary
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllUser = (req, res, next) => {
  User.find({})
    .populate("role_id", "title")
    .then(
      (course) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(course);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getUserById = (req, res, next) => {
  const userId = req.params.userid;
  User.findById(userId)
    .then(
      (user) => {
        if (user) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        } else {
          res.statusCode = 404;
          res.end("User not found");
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getUserByUsername = (req, res, next) => {
  const userName = req.params.userName;
  User.findById({ username: userName })
    .then(
      (user) => {
        if (user) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        } else {
          res.statusCode = 404;
          res.end("User not found");
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getUserByRole = async (req, res, next) => {
  try {
    const roleDescription = req.params.roleDescription;

    // Tìm Role dựa trên mô tả
    const role = await Role.findOne({
      where: { description: roleDescription },
    });

    if (!role) {
      res
        .status(404)
        .json({ error: "No role found with the specified description" });
      return;
    }

    // Tìm tất cả người dùng với role_id tương ứng
    const users = await User.findAll({
      where: { role_id: role.id },
    });

    if (users && users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: "No users found with the specified role" });
    }
  } catch (error) {
    next(error);
  }
};

exports.postAddUser = async (req, res, next) => {
  try {
    // Check if there is an image file uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded." });
    }

    // Get the Cloudinary image URL
    const imageUrl = req.file.path;

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the user
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      image: imageUrl,
      gender: req.body.gender,
      address: req.body.address,
      fullName: req.body.fullName,
      status: req.body.status,
      phone: req.body.phone,
      role_id: req.body.role_id,
    });

    // Create the wallet for the user
    await Wallet.create({
      user_id: user._id,
      balance: 0,
    });

    // Return success response
    res.status(200).json({ success: true, status: "Registration Successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.postLoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).populate("role_id");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Invalid username or password.",
      });
    }

    // Kiểm tra mật khẩu đã hash
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed. Invalid username or password.",
        });
      }
      // Nếu mật khẩu hợp lệ, tạo mã token và trả về cho người dùng
      const token = authenticate.getToken({ _id: user._id });
      res.status(200).json({
        success: true,
        token: token,
        user: user,
        status: "You are successfully logged in!",
      });
    });
  } catch (error) {
    return next(error);
  }
};

exports.fetchMe = async (req, res, next) => {
  const userId = req.decoded._id;
  try {
    const user = await User.findById(userId).populate("role_id");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.banUserByID = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Thay đổi status của user
    user.status = false;
    await user.save();

    // Cập nhật tất cả các report có type là "ban" của thành viên
    await ReportRequest.updateMany(
      { user_id: userId, type_report: "ban" },
      { $set: { status: false, update_timestamp: Date.now() } }
    );

    return res.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMemberCount = async (req, res, next) => {
  try {
    // Tìm vai trò "Member"
    const memberRole = await Role.findOne({ title: "Member" }).exec();

    // Nếu không tìm thấy vai trò, trả về số lượng người dùng là 0
    if (!memberRole) {
      res.json({ memberCount: 0 });
      return;
    }

    // Đếm số lượng người dùng có role_id trùng với ObjectId của vai trò "Member"
    const memberCount = await User.countDocuments({ role_id: memberRole._id }).exec();
    const Count = await Auction.countDocuments().exec(); 

    res.json({ memberCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getHostCount = async (req, res, next) => {
  try {
    // Tìm vai trò "Member"
    const memberRole = await Role.findOne({ title: "Host" }).exec();

    // Nếu không tìm thấy vai trò, trả về số lượng người dùng là 0
    if (!memberRole) {
      res.json({ memberCount: 0 });
      return;
    }

    // Đếm số lượng người dùng có role_id trùng với ObjectId của vai trò "Member"
    const memberCount = await User.countDocuments({ role_id: memberRole._id }).exec();

    res.json({ memberCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAgvMemberAuction = async (req, res, next) => {
  try {
    const memberRole = await Role.findOne({ title: "Member" }).exec();
    if (!memberRole) {
      res.json({ memberCount: 0 });
      return;
    }
    const memberCount = await User.countDocuments({ role_id: memberRole._id }).exec();
    const auctionCount = await Auction.countDocuments({}).exec();
    const avgCount = memberCount/auctionCount;
    res.json({ avgCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};