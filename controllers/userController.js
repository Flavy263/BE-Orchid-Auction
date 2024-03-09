const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");
const ReportRequest = require("../models/Report_Request");

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

exports.postAddUser = (req, res, next) => {
  // Check if there is an image file uploaded
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No image uploaded." });
  }
  // Get the Cloudinary image URL
  const imageUrl = req.file.path;

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Could not create hash!" });
    }

    User.register(
      new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        image: imageUrl,
        gender: req.body.gender,
        address: req.body.address,
        fullName: req.body.fullName,
        status: req.body.status,
        phone: req.body.phone,
        role_id: req.body.role_id,
      }),
      hash,
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
          res.json({ success: true, status: "Registration Successful!" });
          // });
        }
      }
    );
  });
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
  const userId = req.body.userId;

  try {
    // Tìm kiếm người dùng và report request
    const user = await User.findById(userId);
    const reportRequest = await ReportRequest.find({ user_id: userId });

    // Kiểm tra xem người dùng và report request có tồn tại hay không
    if (!user || !reportRequest) {
      return res
        .status(404)
        .json({ error: "User or report request not found." });
    }

    // Cập nhật trạng thái của người dùng và report request thành false
    user.status = false;
    reportRequest.status = false;

    // Lưu các thay đổi vào cơ sở dữ liệu
    await user.save();
    await reportRequest.save();

    res.status(200).json({ message: "User banned successfully." });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
