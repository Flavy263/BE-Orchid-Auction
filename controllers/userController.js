const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const authenticate = require("../authenticate");

var config = require('../config');

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình cloudinary với biến môi trường từ config.js
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Cấu hình multer để lưu trữ tệp trên cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: config.CLOUDINARY_FOLDER_USER_IMAGE, // Folder save img in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Format for img
    format: async (req, file) => 'jpg', // Format in cloudinary
  },
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image'), async (req, res, next) => {
  try {
    // Kiểm tra xem có tệp tin được tải lên không
    if (req.file==null) {
      return res.status(400).json({ error: 'No file provided for upload.' });
    }
    console.log("Start Upload img");
    // Tải lên tệp tin lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.buffer, {
      folder: config.CLOUDINARY_FOLDER_USER_IMAGE, // Sử dụng biến cấu hình
    });
    console.log(result);
    // const userID = req.params.userid;
    // // Lưu đường dẫn của ảnh vào trường image trong MongoDB
    // const user = await User.findById(userID);

    // if (!user) {
    //   return res.status(404).json({ error: 'User not found.' });
    // }

    // user.image = result.secure_url; // Lưu URL của ảnh trong user model
    // await user.save();

    // // Trả về thông báo thành công
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.log('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image.' });
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
      res.status(404).json({ error: 'No role found with the specified description' });
      return;
    }

    // Tìm tất cả người dùng với role_id tương ứng
    const users = await User.findAll({
      where: { role_id: role.id },
    });

    if (users && users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'No users found with the specified role' });
    }
  } catch (error) {
    next(error);
  }
};

exports.postAddUser = (req, res, next) => {
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
        image: req.body.image,
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

// exports.postLoginUser = async (req, res, next) => {
//   passport.authenticate('local', { session: false }, async (err, user, info) => {
//     try {
//       console.log("user", user);
//       const member = await Accounts.findOne({ username: req.body.username });
//       console.log("member", member);

//       if (err) {
//         return next(err);
//       }

//       if (!member) {
//         return res.status(401).json({ success: false, message: 'Authentication failed. Invalid username or password.' });
//       }

//       // Kiểm tra mật khẩu đã hash
//       bcrypt.compare(req.body.password, member.password, (err, result) => {
//         if (err || !result) {
//           return res.status(401).json({ success: false, message: 'Authentication failed. Invalid username or password.' });
//         }
//         // Nếu mật khẩu hợp lệ, tiếp tục
//         req.login(member, { session: false }, (err) => {
//           if (err) {
//             return next(err);
//           }
//           const token = authenticate.getToken({ _id: user._id });
//           res.status(200).json({ success: true, token: token, user: member, status: 'You are successfully logged in!' });
//         });
//       });
//     } catch (error) {
//       return next(error);
//     }
//   })(req, res, next);
// };

exports.postLoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).populate('role_id');

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

// exports.fetchMe = async (req, res, next) => {
//   const userId = req.decoded._id;
//   User.findById(userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found.' });
//       }
//       res.status(200).json({ success: true, user: user });
//     })
//     .catch(err => {
//       console.error('Error finding user:', err);
//       res.status(500).json({ success: false, message: 'Internal server error.' });
//     });
// };
exports.fetchMe = async (req, res, next) => {
  const userId = req.decoded._id;
  try {
    const user = await User.findById(userId).populate('role_id');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
