const WalletHistorys = require("../models/Wallet_History");

exports.getWallet = (req, res, next) => {
  WalletHistorys.find({})
  .populate("user_id")
    .then(
      (wallet) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(wallet);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.createEmptyWallet = (req, res, next) => {
    WalletHistorys.create({})
      .then(
        (wallet) => {
          console.log("Wallet Created ", wallet);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(wallet);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  };

exports.createWallet = (req, res, next) => {
  WalletHistorys.create(req.body)
    .then(
      (wallet) => {
        console.log("Wallet Created ", wallet);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(wallet);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getWalletByID = (req, res, next) => {
  WalletHistorys.findById(req.params.roleId)
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

exports.updateWalletByID = (req, res, next) => {
  WalletHistorys.findByIdAndUpdate(
    req.params.roleId,
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

exports.deleteWalletByID = (req, res, next) => {
  WalletHistorys.findByIdAndDelete(req.params.roleId)
    .then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

