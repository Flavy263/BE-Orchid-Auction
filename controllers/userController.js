
const User = require("../models/User");
const passport = require('passport');
const bcrypt = require('bcrypt');
const authenticate = require('../authenticate');
exports.getAllUser = ((req, res, next) => {
  User.find({})
    .then(
      (course) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(course);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
})
exports.postAddUser = ((req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not create hash!' });
    }
    User.register(new User({ username: req.body.username, password: hash, email: req.body.email, image: req.body.image, gender: req.body.gender, address: req.body.address, fullName: req.body.fullName, status: req.body.status, phone: req.body.phone, role_id: req.body.role_id }),
      hash, (err, user) => {
        // console.log("req",req);
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        }
        else {
          // passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
          // });
        }
      });
  });
})

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

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication failed. Invalid username or password.' });
    }

    // Kiểm tra mật khẩu đã hash
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ success: false, message: 'Authentication failed. Invalid username or password.' });
      }
      // Nếu mật khẩu hợp lệ, tạo mã token và trả về cho người dùng
      const token = authenticate.getToken({ _id: user._id });
      res.status(200).json({ success: true, token: token, user: user, status: 'You are successfully logged in!' });
    });
  } catch (error) {
    return next(error);
  }
};

