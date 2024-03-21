const User = require("../models/User");
const Wallet = require("../models/Wallet");
const passport = require("passport");
const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");
const ReportRequest = require("../models/Report_Request");
const Role = require("../models/Role");
const Auction = require("../models/Auction");
const AuctionMember = require("../models/Auction_Member");
const Config = require("../config");
const OTP = require("../models/OTP");
const nodemailer = require('nodemailer');

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

    // Check if username already exists
    const existingUsername = await User.findOne({ username: req.body.username });
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingUsername && existingEmail) {
      return res.status(400).json({ success: false, message: "Username and email already exist." });
    }
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already exists." });
    }

    // Check if email already exists

    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }


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
    res.status(200).json({ success: true, message: "Registration Successful!" });
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
        message: "Username và password không chính xác.",
      });
    }

    // Kiểm tra mật khẩu đã hash
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({
          success: false,
          message: "Password không chính xác.",
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

exports.getMemberCountToday = async (req, res) => {
  try {
    // Lấy ngày hôm nay
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Tìm role_id của vai trò "Member"
    const memberRole = await Role.findOne({ title: "MEMBER" }).exec();

    if (!memberRole) {
      return res.status(404).json({ error: "Role 'Member' not found" });
    }

    // Sử dụng Mongoose để đếm số người tham gia vào hệ thống với vai trò là Member trong ngày hôm nay
    const memberCount = await User.countDocuments({
      role_id: memberRole._id,
      timestamp: { $gte: startOfToday, $lt: endOfToday },
    }).exec();

    res.json({ memberCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getHostCountToday = async (req, res) => {
  try {
    // Lấy ngày hôm nay
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Tìm role_id của vai trò "Member"
    const userRole = await Role.findOne({ title: "HOST" }).exec();

    if (!userRole) {
      return res.status(404).json({ error: "Role 'Host' not found" });
    }

    // Sử dụng Mongoose để đếm số người tham gia vào hệ thống với vai trò là Member trong ngày hôm nay
    const userCount = await User.countDocuments({
      role_id: userRole._id,
      timestamp: { $gte: startOfToday, $lt: endOfToday },
    }).exec();

    res.json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemberCountYesterday = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
    const endOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate() + 1
    );

    // Tìm role_id của vai trò "Member"
    const userRole = await Role.findOne({ title: "Member" }).exec();

    if (!userRole) {
      return res.status(404).json({ error: "Role 'Member' not found" });
    }

    // Sử dụng Mongoose để đếm số người tham gia vào hệ thống với vai trò là Member trong ngày hôm nay
    const userCount = await User.countDocuments({
      role_id: userRole._id,
      timestamp: { $gte: startOfYesterday, $lt: endOfYesterday },
    }).exec();

    res.json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getHostCountYesterday = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
    const endOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate() + 1
    );

    // Tìm role_id của vai trò "Member"
    const userRole = await Role.findOne({ title: "HOST" }).exec();

    if (!userRole) {
      return res.status(404).json({ error: "Role 'Host' not found" });
    }

    // Sử dụng Mongoose để đếm số người tham gia vào hệ thống với vai trò là Member trong ngày hôm nay
    const userCount = await User.countDocuments({
      role_id: userRole._id,
      timestamp: { $gte: startOfYesterday, $lt: endOfYesterday },
    }).exec();

    res.json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemberCountTwodayAgo = async (req, res) => {
  try {
    const twoDayAgo = new Date();
    twoDayAgo.setDate(twoDayAgo.getDate() - 2);
    const startOfTwoDayAgo = new Date(
      twoDayAgo.getFullYear(),
      twoDayAgo.getMonth(),
      twoDayAgo.getDate()
    );
    const endOfTwoDayAgo = new Date(
      twoDayAgo.getFullYear(),
      twoDayAgo.getMonth(),
      twoDayAgo.getDate() + 1
    );

    // Tìm role_id của vai trò "Member"
    const userRole = await Role.findOne({ title: "Member" }).exec();

    if (!userRole) {
      return res.status(404).json({ error: "Role 'Member' not found" });
    }

    // Sử dụng Mongoose để đếm số người tham gia vào hệ thống với vai trò là Member trong ngày hôm nay
    const userCount = await User.countDocuments({
      role_id: userRole._id,
      timestamp: { $gte: startOfTwoDayAgo, $lt: endOfTwoDayAgo },
    }).exec();

    res.json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getHostCountTwodayAgo = async (req, res) => {
  try {
    const twoDayAgo = new Date();
    twoDayAgo.setDate(twoDayAgo.getDate() - 2);
    const startOfTwoDayAgo = new Date(
      twoDayAgo.getFullYear(),
      twoDayAgo.getMonth(),
      twoDayAgo.getDate()
    );
    const endOfTwoDayAgo = new Date(
      twoDayAgo.getFullYear(),
      twoDayAgo.getMonth(),
      twoDayAgo.getDate() + 1
    );

    // Tìm role_id của vai trò "Member"
    const userRole = await Role.findOne({ title: "HOST" }).exec();

    if (!userRole) {
      return res.status(404).json({ error: "Role 'Host' not found" });
    }

    // Sử dụng Mongoose để đếm số người tham gia vào hệ thống với vai trò là Member trong ngày hôm nay
    const userCount = await User.countDocuments({
      role_id: userRole._id,
      timestamp: { $gte: startOfTwoDayAgo, $lt: endOfTwoDayAgo },
    }).exec();

    res.json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemberCount = async (req, res, next) => {
  try {
    // Tìm vai trò "Member"
    const memberRole = await Role.findOne({ title: "MEMBER" }).exec();

    // Nếu không tìm thấy vai trò, trả về số lượng người dùng là 0
    if (!memberRole) {
      res.json({ memberCount: 0 });
      return;
    }

    // Đếm số lượng người dùng có role_id trùng với ObjectId của vai trò "Member"
    const memberCount = await User.countDocuments({
      role_id: memberRole._id,
    }).exec();
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
    const memberRole = await Role.findOne({ title: "HOST" }).exec();

    // Nếu không tìm thấy vai trò, trả về số lượng người dùng là 0
    if (!memberRole) {
      res.json({ memberCount: 0 });
      return;
    }

    // Đếm số lượng người dùng có role_id trùng với ObjectId của vai trò "Member"
    const memberCount = await User.countDocuments({
      role_id: memberRole._id,
    }).exec();

    res.json({ memberCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAgvMemberAuction = async (req, res, next) => {
  try {
    // Tìm Role có title là "MEMBER"
    const memberRole = await Role.findOne({ title: "MEMBER" });
    if (!memberRole) {
      return res.status(404).json({ error: "Role MEMBER not found" });
    }
    // Tìm tất cả User có role là "MEMBER"
    const members = await User.find({ role_id: memberRole._id });
    if (members.length === 0) {
      return res.status(404).json({ error: "No users found with role MEMBER" });
    }
    // Đếm số lượng AuctionMember có member_id là các user thuộc role "MEMBER"
    const memberCount = await AuctionMember.countDocuments({
      member_id: { $in: members.map((member) => member._id) },
    });
    const auctionCount = await Auction.countDocuments({}).exec();
    if (auctionCount.length === 0 || auctionCount == null) {
      return res
        .status(404)
        .json({
          error:
            "No auction found to caculate agv member join in auction per auction",
        });
    }
    const avgCount = memberCount / auctionCount;
    res.json({ avgCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Send mail function
async function sendVerificationEmail(userEmail, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Config.ADMIN_EMAIL,
        pass: Config.ADMIN_PASS_EMAIL
      }
    });
    const mailOptions = {
      from: Config.ADMIN_EMAIL,
      to: userEmail,
      subject: subject,
      text: text
    };

    await transporter.sendMail(mailOptions);
    // console.log('Verification email sent successfully.');
  } catch (error) {
    // console.error('Error sending verification email:', error);
    throw error;
  }
}

exports.sendMailOTP = async (req, res, next) => {
  try {
    // Tạo mã xác thực ngẫu nhiên 6 so
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const email = req.body.UserMail;

    const user = await User.findOne({ email });
    if (user != null) {
      return res
        .status(400)
        .json({
          error:
            "This email is used!",
        });
    }
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu OTP chưa
    let userOTP = await OTP.findOne({ user_mail: email });
    if (!userOTP) {
      // Nếu email chưa tồn tại, tạo mới một bản ghi OTP
      userOTP = new OTP({
        user_mail: email,
        otp_code: verificationCode
      });
    } else {
      // Nếu email đã tồn tại, cập nhật mã xác thực của bản ghi OTP
      userOTP.otp_code = verificationCode;
    }

    // Lưu thông tin người dùng và mã xác thực vào cơ sở dữ liệu OTP
    await userOTP.save();
    const subject = 'Verification Code for Registration';
    const text = `Your verification code is: ${verificationCode}`;
    // Gửi email xác thực
    await sendVerificationEmail(email, subject, text);

    res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.checkOTP = async (req, res, next) => {
  try {
    const { user_mail, otp_code } = req.body;

    // Kiểm tra xem mã xác thực có khớp với mã trong cơ sở dữ liệu hay không
    const OTPObject = await OTP.findOne({ user_mail: user_mail, otp_code: otp_code });
    if (!OTPObject) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getAllOTP = (req, res, next) => {
  OTP.find({})
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


exports.postAddOTP = async (req, res, next) => {
  try {

    const user = await OTP.create({
      user_mail: req.body.UserMail,
      otp_code: req.body.OTPCode
    });

    // Return success response
    res.status(200).json({ success: true, status: "Registration Successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateUserByID = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (role) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(role);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};