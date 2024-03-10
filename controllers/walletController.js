const Wallets = require("../models/Wallet");
const WalletHistorys = require("../models/Wallet_History");
const Auction = require("../models/Auction");
const ReportRequest = require("../models/Report_Request");
const AuctionMember = require("../models/Auction_Member");
const User = require("../models/User");
const Config = require("../models/Config");

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

exports.getWalletByUserId = (req, res, next) => {
  const user_id = req.params.userId;
  console.log("userId", user_id);
  Wallets.findOne({ user_id})
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
    const wallet = await Wallets.findOne({ user_id });

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
    await WalletHistorys.create({
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

exports.browseDeposit = async (req, res) => {
  try {
    const { reportRequestId, depositAmount, note } = req.body;

    // Thay đổi trạng thái của reportRequest
    const updatedReport = await ReportRequest.findByIdAndUpdate(
      reportRequestId,
      { status: false, note: note, update_timestamp: Date.now() },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ error: "ReportRequest not found." });
    }

    // Nạp tiền vào ví
    const wallet = await Wallets.findOne({ user_id: updatedReport.user_id });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for the user." });
    }

    wallet.balance += depositAmount;
    await wallet.save();

    // Ghi lại log trong WalletHistory
    await WalletHistorys.create({
      wallet_id: wallet._id,
      amount: depositAmount,
      type: "deposit",
    });

    res.status(200).json({ message: "Status changed and deposit successful." });
  } catch (error) {
    console.error("Error changing status and depositing money:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const mongoose = require("mongoose");

exports.registerJoinInAuction = async (req, res) => {
  try {
    const { userId, auctionId } = req.body;

    // Kiểm tra xem auction có tồn tại không
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found!" });
    }
    
    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
   
    // Kiểm tra xem user có ví tiền không
    const wallet = await Wallets.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(400).json({ error: "User has no wallet!" });
    }
 
    // Kiểm tra xem member có đăng ký chưa
    const participation = await AuctionMember.findOne({
      auction_id: auctionId,
      member_id: userId,
    });

    if (participation) {
      return res.status(400).json({ message: "You have entered this auction!" });
    }

    // So sánh ví tiền của user và giá khởi điểm của auction
    const config = await Config.findOne({ type_config: "Join in auction" });
    console.log(config.money); 
    if (wallet.balance < config.money) {
      return res
        .status(400)
        .json({ error: "Not enough money to place a bid!" });
    }

    // Trừ tiền từ ví
    const bidAmount = config.money; // Giả sử bidAmount bằng giá khởi điểm
    wallet.balance -= bidAmount;
    await wallet.save();
    
    // Ghi lịch sử vào WalletHistory
    const walletHistory = new WalletHistorys({
      wallet_id: wallet._id,
      amount: bidAmount,
      type: "withdraw",
    });
    await walletHistory.save();

    // Ghi user vào danh sách AuctionMember
    const auctionMember = new AuctionMember({
      auction_id: auctionId,
      member_id: userId,
    });
    await auctionMember.save();

    res.status(200).json({ message: "Bid placed successfully." });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getWalletHistoryByUserID = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    // Tìm ví của người dùng
    const wallet = await Wallets.findOne({ user_id });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for the user." });
    }

    // Lấy lịch sử của ví
    const walletHistory = await WalletHistorys.find({ wallet_id: wallet._id });

    res.status(200).json(walletHistory);
  } catch (error) {
    console.error("Error fetching wallet history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
