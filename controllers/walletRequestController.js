// crud product
const Wallet_Request = require("../models/Wallet_Request");

exports.getAllWalletRequest = (req, res, next) => {
  Wallet_Request.find({ status: true })
    .then((walletRequest) => {
      if (!walletRequest || walletRequest.length === 0) {
        // Nếu không có cái nào nào thỏa mãn điều kiện, trả về thông báo hoặc mã lỗi
        const err = new Error("No active wallet request found.");
        err.status = 404; // Mã lỗi 404 - Not Found
        throw err;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(walletRequest);
    })
    .catch((err) => next(err));
};

exports.getWalletRequestById = (req, res, next) => {
    const walletRequestId = req.params.walletRequestId;
    Wallet_Request.findById(walletRequestId)
      .then(
        (walletRequest) => {
          if (walletRequest) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(walletRequest);
          } else {
            res.statusCode = 404;
            res.end("Wallet Request not found");
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  };

exports.postAddWalletRequest = (req, res, next) => {
  Wallet_Request.create(req.body)
    .then(
      (walletRequest) => {
        console.log("Product Created ", walletRequest);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Created Successful!",
          walletRequest: walletRequest,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.putUpdateWalletRequest = (req, res, next) => {
  Wallet_Request.findByIdAndUpdate(
    req.params.walletRequestId,
    {
      $set: {status:false},
    },
    { new: true }
  )
    .then(
      (walletRequest) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Update Successful!",
          walletRequest: walletRequest,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.deleteWalletRequest = (req, res, next) => {
  const walletRequestId = req.params.walletRequestId;
  Wallet_Request.findByIdAndUpdate(
    walletRequestId,
    { $set: { status: false } },
    { new: true }
  )
    .then((walletRequest) => {
      if (!walletRequest) {
        // Nếu không tìm thấy sản phẩm, trả về lỗi
        const err = new Error(`Product with ID ${walletRequestId} not found.`);
        err.status = 404;
        throw err;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "Update Successful!",
        walletRequest: walletRequest,
      });
    })
    .catch((err) => next(err));
};
