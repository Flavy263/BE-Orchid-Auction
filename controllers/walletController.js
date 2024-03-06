const Wallets = require("../models/Wallet");
const WalletHistorys = require("../models/Wallet_History");

exports.getWallet = (req, res, next) => {
  Wallets.find({})
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
  Wallets.create({})
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
  Wallets.create(req.body)
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
  Wallets.findById(req.params.roleId)
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
  Wallets.findByIdAndUpdate(
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

exports.addMoney = async (req, res, next) => {
  try {
    const { user_id, amount } = req.body;

    // Tìm ví của người dùng
    const wallet = await Wallets.findOne({ user_id });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for the user." });
    }

    // Cộng tiền vào ví
    wallet.balance += amount;
    await wallet.save();

    // Lưu lịch sử thay đổi
    await WalletHistorys.create({
      wallet_id: wallet._id,
      amount,
      type: "deposit",
    });

    res.status(200).json({ message: "Deposit successful." });
  } catch (error) {
    console.error("Error depositing money:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.withdrawMoney = async (req, res, next) => {
  try {
    const { user_id, amount } = req.body;

    // Tìm ví của người dùng
    const wallet = await Wallet.findOne({ user_id });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for the user." });
    }

    // Kiểm tra xem có đủ tiền để rút không
    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds." });
    }

    // Rút tiền từ ví
    wallet.balance -= amount;
    await wallet.save();

    // Lưu lịch sử thay đổi
    await WalletHistory.create({
      wallet_id: wallet._id,
      amount,
      type: "withdraw",
    });

    res.status(200).json({ message: "Withdrawal successful." });
  } catch (error) {
    console.error("Error withdrawing money:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
