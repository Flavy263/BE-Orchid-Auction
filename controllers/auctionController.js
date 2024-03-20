const moment = require("moment");
const schedule = require("node-schedule");
const Auctions = require("../models/Auction");
const Orders = require("../models/Order");
const socketIo = require("socket.io");
const Product = require("../models/Product");
const Wallets = require("../models/Wallet");
const WalletHistorys = require("../models/Wallet_History");
const Config = require("../models/Config");
const Auction_bid = require("../models/Auction_Bid");
const AuctionMembers = require("../models/Auction_Member");
const AuctionMember = require("../models/Auction_Member");
const AuctionBid = require("../models/Auction_Bid");
const User = require("../models/User");

// Đường dẫn đến model của phiên đấu giá
// router.post('/newAuction', async (req, res) => {
//   try {
//     const updatedAuction = await Auctions.findByIdAndUpdate(auctionId, { status: newStatus }, { new: true });
//     console.log(`Updated status of auction ${auctionId} to ${newStatus}`);
//   } catch (error) {
//     res.status(500).json({ message: `Error creating auction: ${error.message}` });
//   }
// });

// Hàm này sẽ được gọi khi có một phiên đấu giá kết thúc
// async function updateAuctionStatus(auctionId, newStatus, io) {
//   try {
//     const updatedAuction = await Auctions.findByIdAndUpdate(auctionId, { status: newStatus }, { new: true });
//     console.log(`Updated status of auction ${auctionId} to ${newStatus}`);
//     io.emit('auction_status_changed', { auctionId, newStatus });
//   } catch (error) {
//     console.error(`Error updating auction status: ${error.message}`);
//   }
// }
// const io = require('../app').get('socketio');
// crontab -e
async function updateAuctionStatus(auctionId, newStatus, io) {
  try {
    const updatedAuction = await Auctions.findByIdAndUpdate(
      auctionId,
      { status: newStatus },
      { new: true }
    );
    // console.log(`Updated status of auction ${auctionId} to ${newStatus}`);
    if (io) {
      io.emit("auction_status_changed", { auctionId, newStatus });
    } else {
      console.error("Socket connection is undefined");
    }
  } catch (error) {
    console.error(`Error updating auction status: ${error.message}`);
  }
}

function scheduleAuctionStatusUpdates(auction, io) {
  const {
    _id,
    start_time,
    end_time,
    regitration_start_time,
    regitration_end_time,
  } = auction;
  const startTime = moment(start_time, "YYYY-MM-DDTHH:mm:ssZ").toDate();
  const endTime = moment(end_time, "YYYY-MM-DDTHH:mm:ssZ").toDate();
  const regitrationStartTime = moment(
    regitration_start_time,
    "YYYY-MM-DDTHH:mm:ssZ"
  ).toDate();
  const regitrationEndTime = moment(
    regitration_end_time,
    "YYYY-MM-DDTHH:mm:ssZ"
  ).toDate();
  // Kiểm tra và cập nhật trạng thái khi qua mốc thời gian
  schedule.scheduleJob(regitrationStartTime, async () => {
    await updateAuctionStatus(_id, "not yet auctioned", io);
  });

  schedule.scheduleJob(regitrationEndTime, async () => {
    await updateAuctionStatus(_id, "about to auction", io);
  });

  schedule.scheduleJob(startTime, async () => {
    await updateAuctionStatus(_id, "auctioning", io);
  });

  schedule.scheduleJob(endTime, async () => {
    await updateAuctionStatus(_id, "auctioned", io);
  });
}
exports.getAllAuction = (req, res, next) => {
  Auctions.find()
    .populate("host_id")
    .populate("product_id")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.createAuction = async (req, res, next) => {
  try {
    const product_id = req.body.product_id;

    // Check if the host_id exists and has status true
    const host = await User.findOne({ _id: req.body.host_id, status: true });
    if (!host) {
      return res.status(400).json({ error: "You are banned!!!" });
    }

    const wallet = await Wallets.findOne({ user_id: req.body.host_id });

    if (!wallet) {
      return res.status(400).json({ error: "User has no wallet!" });
    }

    const config = await Config.findOne({ type_config: "Create auction" });
    // console.log("money", config);
    // console.log("money", config);
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

    const auction = await Auctions.create(req.body);
    const auctionBid = new Auction_bid({
      auction_id: auction._id,
      price: auction.starting_price,
    });
    await auctionBid.save();
    const auctionMemberForHost = await AuctionMembers.create({
      auction_id: auction._id,
      member_id: req.body.host_id,
    });
    // Tìm và cập nhật trạng thái sản phẩm
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product_id },
      { $set: { status: true } },
      { new: true }
    );
    // const auctionBidData = {
    //   auction_id: auction._id, // Đây là id của phiên đấu giá vừa được tạo
    //   price: req.body.starting_price, // Giả sử bidAmount bằng giá khởi điểm
    //   customer_id: req.body.host_id,
    //   create_time: new Date(), // Thời gian hiện tại
    // };
    // console.log("Auction Created ", auction);
    // try {
    //   const auctionBid = await AuctionBid.create(auctionBidData);
    //   console.log("AuctionBid", auctionBid);
    // } catch (auctionBidError) {
    //   // Log and handle the error occurred during AuctionBid creation
    //   console.error("Error occurred while creating AuctionBid:", auctionBidError);
    //   // You can choose to send an appropriate response here
    // }

    // Kiểm tra xem sản phẩm có tồn tại và được cập nhật không
    if (updatedProduct) {
      // Sau khi phiên đấu giá được tạo, gọi hàm để lên lịch cập nhật trạng thái
      await scheduleAuctionStatusUpdates(auction, req.app.get("socketio"));

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(auction);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        message: "Product not found or not updated.",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAuctionByUserId = (req, res, next) => {
  const hostId = req.params.host_id;
  Auctions.find({ host_id: hostId })
    .then(
      (user) => {
        if (user) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        } else {
          res.statusCode = 404;
          res.end("Auction not found");
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionByID = (req, res, next) => {
  Auctions.findById(req.params.auctionId)
    .populate("product_id")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionNotAuctionedByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "not" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionNotYetAuctionedByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "not yet auctioned" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionAboutToAuctionByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "about to auction" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionAuctioningByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "auctioning" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionaAuctionedByUser = (req, res, next) => {
  Auctions.find({ host_id: req.params.host_id, status: "auctioned" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.updateAuctionByID = (req, res, next) => {
  Auctions.findByIdAndUpdate(
    req.params.auctionId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.deleteAuctionByID = (req, res, next) => {
  Auctions.findByIdAndDelete(req.params.auctionId)
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
exports.getAuctionNotAuctioned = (req, res, next) => {
  Auctions.find({ status: "not" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionNotYetAuctioned = (req, res, next) => {
  Auctions.find({ status: "not yet auctioned" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionAboutToAuction = (req, res, next) => {
  Auctions.find({ status: "about to auction" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionAuctioning = (req, res, next) => {
  Auctions.find({ status: "auctioning" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionaAuctioned = (req, res, next) => {
  Auctions.find({ status: "auctioned" })
    .populate("host_id", "fullName")
    .populate("product_id", "name")
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};



exports.checkUserInAuction = (auctionId, userId) => {
  return AuctionMember.findOne({ auction_id: auctionId, member_id: userId })
    .then(
      (auction) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.createOrder = (req, res, next) => {
  Orders.create(req.body)
    .then(
      (order) => {
        // console.log("Order Created ", order);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.updateOrder = (req, res, next) => {
  Orders.findByIdAndUpdate(
    req.params.orderId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (order) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Update Successful!",
          order: order,
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getOrderByMemberID = async (req, res) => {
  const memberId = req.params.memberId;
  try {
    const orders = await Orders.find({
      $and: [
        { winner_id: memberId },
        { host_id: memberId }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getOrderByHostID = async (req, res) => {
  try {
    const hostId = req.params.hostId;
    // Sử dụng phương thức find của Mongoose để tìm tất cả các đơn hàng với host_id cụ thể
    const orders = await Orders.find({ host_id: hostId });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by host_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkAuctionParticipation = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const memberId = req.params.memberId;

    // Kiểm tra xem thành viên đã tham gia đấu giá chưa
    const participation = await AuctionMember.findOne({
      auction_id: auctionId,
      member_id: memberId,
    });
    if (participation) {
      return res
        .status(400)
        .json({ message: "Bạn đã tham gia đấu giá này rồi." });
    }

    return res.status(200).json({ message: "Bạn chưa tham gia đấu giá này." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMemberAuctionNotYet = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    // Tìm tất cả các đấu giá mà thành viên đã đăng ký
    const registeredAuctions = await AuctionMember.find({
      member_id: memberId,
    }).populate({
      path: "auction_id",
      populate: {
        path: "product_id",
        model: "Product",
      },
    });

    // Lọc các đấu giá theo status
    const filteredAuctions = registeredAuctions.filter((auctionMember) => {
      const auctionStatus = auctionMember.auction_id?.status;
      // Điều kiện lọc theo status, bạn có thể thay đổi tùy theo yêu cầu
      return auctionStatus === "not yet auctioned";
    });

    // Tạo một mảng chứa thông tin cần thiết từ các đấu giá và sản phẩm
    const resultAuctions = filteredAuctions.map((auctionMember) => {
      const auction = auctionMember.auction_id;
      const product = auction.product_id;

      return {
        auction_id: auction._id,
        price_step: auction.price_step,
        starting_price: auction.starting_price,
        auctionInfo: auction.auctionInfo,
        start_time: auction.start_time,
        end_time: auction.end_time,
        regitration_start_time: auction.regitration_start_time,
        regitration_end_time: auction.regitration_end_time,
        status: auction.status,
        host_id: auction.host_id,
        product: {
          _id: product._id,
          name: product.name,
          image: product.image,
          video: product.video,
          description: product.description,
          status: product.status,
          host_id: product.host_id,
          timestamp: product.timestamp,
        },
      };
    });
    // console.log(resultAuctions);
    res.status(200).json(resultAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemberAuctionAboutTo = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    // Tìm tất cả các đấu giá mà thành viên đã đăng ký
    const registeredAuctions = await AuctionMember.find({
      member_id: memberId,
    }).populate({
      path: "auction_id",
      populate: {
        path: "product_id",
        model: "Product",
      },
    });
    // console.log("registeredAuctions", registeredAuctions);
    // Lọc các đấu giá theo status
    const filteredAuctions = registeredAuctions.filter((auctionMember) => {
      const auctionStatus = auctionMember.auction_id?.status;
      // Điều kiện lọc theo status, bạn có thể thay đổi tùy theo yêu cầu
      return auctionStatus === "about to auction";
    });

    // Tạo một mảng chứa thông tin cần thiết từ các đấu giá và sản phẩm
    const resultAuctions = filteredAuctions.map((auctionMember) => {
      const auction = auctionMember.auction_id;
      const product = auction.product_id;

      return {
        auction_id: auction._id,
        price_step: auction.price_step,
        starting_price: auction.starting_price,
        auctionInfo: auction.auctionInfo,
        start_time: auction.start_time,
        end_time: auction.end_time,
        regitration_start_time: auction.regitration_start_time,
        regitration_end_time: auction.regitration_end_time,
        status: auction.status,
        host_id: auction.host_id,
        product: {
          _id: product._id,
          name: product.name,
          image: product.image,
          video: product.video,
          description: product.description,
          status: product.status,
          host_id: product.host_id,
          timestamp: product.timestamp,
        },
      };
    });
    // console.log(resultAuctions);
    res.status(200).json(resultAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemberAuctionAuctioning = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    // Tìm tất cả các đấu giá mà thành viên đã đăng ký
    const registeredAuctions = await AuctionMember.find({
      member_id: memberId,
    }).populate({
      path: "auction_id",
      populate: {
        path: "product_id",
        model: "Product",
      },
    });

    // Lọc các đấu giá theo status
    const filteredAuctions = registeredAuctions.filter((auctionMember) => {
      const auctionStatus = auctionMember.auction_id?.status;
      // Điều kiện lọc theo status, bạn có thể thay đổi tùy theo yêu cầu
      return auctionStatus === "auctioning";
    });

    // Tạo một mảng chứa thông tin cần thiết từ các đấu giá và sản phẩm
    const resultAuctions = filteredAuctions.map((auctionMember) => {
      const auction = auctionMember.auction_id;
      const product = auction.product_id;

      return {
        auction_id: auction._id,
        price_step: auction.price_step,
        starting_price: auction.starting_price,
        auctionInfo: auction.auctionInfo,
        start_time: auction.start_time,
        end_time: auction.end_time,
        regitration_start_time: auction.regitration_start_time,
        regitration_end_time: auction.regitration_end_time,
        status: auction.status,
        host_id: auction.host_id,
        product: {
          _id: product._id,
          name: product.name,
          image: product.image,
          video: product.video,
          description: product.description,
          status: product.status,
          host_id: product.host_id,
          timestamp: product.timestamp,
        },
      };
    });
    // console.log(resultAuctions);
    res.status(200).json(resultAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemberAuctionAuctioned = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    // Tìm tất cả các đấu giá mà thành viên đã đăng ký
    const registeredAuctions = await AuctionMember.find({
      member_id: memberId,
    }).populate({
      path: "auction_id",
      populate: {
        path: "product_id",
        model: "Product",
      },
    });

    // Lọc các đấu giá theo status
    const filteredAuctions = registeredAuctions.filter((auctionMember) => {
      const auctionStatus = auctionMember.auction_id?.status;
      // Điều kiện lọc theo status, bạn có thể thay đổi tùy theo yêu cầu
      return auctionStatus === "auctioned";
    });
    // console.log("memberAuctioned", filteredAuctions);
    // Tạo một mảng chứa thông tin cần thiết từ các đấu giá và sản phẩm
    const resultAuctions = filteredAuctions.map((auctionMember) => {
      const auction = auctionMember.auction_id;
      const product = auction.product_id;

      return {
        auction_id: auction._id,
        price_step: auction.price_step,
        starting_price: auction.starting_price,
        auctionInfo: auction.auctionInfo,
        start_time: auction.start_time,
        end_time: auction.end_time,
        regitration_start_time: auction.regitration_start_time,
        regitration_end_time: auction.regitration_end_time,
        status: auction.status,
        host_id: auction.host_id,
        product: {
          _id: product._id,
          name: product.name,
          image: product.image,
          video: product.video,
          description: product.description,
          status: product.status,
          host_id: product.host_id,
          timestamp: product.timestamp,
        },
      };
    });
    // console.log(resultAuctions);
    res.status(200).json(resultAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMostPriceInAuctionBid = async (req, res, next) => {
  try {
    const auctionId = req.params.auctionId;

    // Tìm auction_bid có giá lớn nhất theo auction_id
    const highestBid = await Auction_bid.findOne({ auction_id: auctionId })
      .sort({ price: -1 }) // Sắp xếp theo giá giảm dần để lấy giá lớn nhất
      .limit(1);

    if (highestBid) {
      res.status(200).json(highestBid);
    } else {
      res
        .status(404)
        .json({ message: "Không tìm thấy auction_bid cho phiên đấu giá này." });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllMemberInAuctionBid = async (req, res, next) => {
  try {
    const auctionId = req.params.auctionId;

    // Kiểm tra xem auctionId đã được cung cấp hay chưa
    if (!auctionId) {
      return res.status(400).json({ error: "Auction ID is required." });
    }

    // Truy vấn cơ sở dữ liệu để tìm tất cả các thông tin từ cả hai bảng AuctionMembers và User
    const auctionMembers = await AuctionMembers.find({ auction_id: auctionId })
      .populate({
        path: "member_id",
        populate: { path: "role_id" }, // Populate role_id trong bảng User
      })
      .populate("auction_id"); // Populate thông tin về phiên đấu giá từ bảng Auction

    res.json(auctionMembers); // Trả về danh sách các thành viên trong phiên đấu giá với thông tin đầy đủ
  } catch (err) {
    next(err);
  }
};

exports.getAuctionsCreatedToday = async (req, res) => {
  try {
    const requestedDate = new Date(req.params.date);
    const startOfDay = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate()
    );
    const endOfDay = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate() + 1
    );

    // Sử dụng Mongoose để đếm số lượng sản phẩm được tạo trong ngày cụ thể

    const Count = await Auctions.countDocuments({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    }).exec();

    res.json({ Count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAuctionCount = async (req, res) => {
  try {
    const Count = await Auctions.countDocuments().exec(); // Đếm tổng số lượng phiên đấu giá
    res.json({ Count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNotYetAuctionCount = async (req, res) => {
  try {
    const statusAuction = "not yet auctioned";
    const Count = await Auctions.countDocuments({
      status: statusAuction,
    }).exec(); // Đếm số lượng phiên đấu giá có trạng thái là status
    res.json({ Count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAboutToAuctionCount = async (req, res, next) => {
  try {
    const statusAuction = "about to auction";
    const Count = await Auctions.countDocuments({
      status: statusAuction,
    }).exec(); // Đếm số lượng phiên đấu giá có trạng thái là status
    res.json({ Count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAuctioningAuctionCount = async (req, res, next) => {
  try {
    const statusAuction = "auctioning";
    const Count = await Auctions.countDocuments({
      status: statusAuction,
    }).exec(); // Đếm số lượng phiên đấu giá có trạng thái là status
    res.json({ Count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAuctionCountToday = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Sử dụng Mongoose để đếm số lượng phiên đấu giá được tạo trong ngày hôm nay
    const auctionCount = await Auctions.countDocuments({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    }).exec();

    res.json({ auctionCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAuctionCountYesterday = async (req, res) => {
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

    // Sử dụng Mongoose để đếm số lượng phiên đấu giá được tạo trong ngày hôm qua
    const auctionCount = await Auctions.countDocuments({
      timestamp: { $gte: startOfYesterday, $lt: endOfYesterday },
    }).exec();

    res.json({ auctionCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAuctionCountTwodayAgo = async (req, res) => {
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

    // Sử dụng Mongoose để đếm số lượng phiên đấu giá được tạo trong ngày hôm qua
    const auctionCount = await Auctions.countDocuments({
      timestamp: { $gte: startOfTwoDayAgo, $lt: endOfTwoDayAgo },
    }).exec();

    res.json({ auctionCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAverageAuctionMembersToday = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Sử dụng Mongoose để tính số lượng thành viên tham gia vào các phiên đấu giá trong hôm nay
    const totalMembers = await AuctionMember.countDocuments({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    }).exec();

    // Sử dụng Mongoose để lọc và đếm số phiên đấu giá mà có ít nhất một thành viên đăng ký trong ngày hôm nay
    const registeredAuctionCount = await AuctionMember.distinct("auction_id", {
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    }).exec();

    // Tính số trung bình thành viên tham gia
    const averageMembers = totalMembers / registeredAuctionCount.length;

    res.json({ averageMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAverageAuctionMembersYesterday = async (req, res) => {
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

    // Sử dụng Mongoose để tính số lượng thành viên tham gia vào các phiên đấu giá trong hôm nay
    const totalMembers = await AuctionMember.countDocuments({
      timestamp: { $gte: startOfYesterday, $lt: endOfYesterday },
    }).exec();

    // Sử dụng Mongoose để lọc và đếm số phiên đấu giá mà có ít nhất một thành viên đăng ký trong ngày hôm nay
    const registeredAuctionCount = await AuctionMember.distinct("auction_id", {
      timestamp: { $gte: startOfYesterday, $lt: endOfYesterday },
    }).exec();

    // Tính số trung bình thành viên tham gia
    const averageMembers = totalMembers / registeredAuctionCount.length;

    res.json({ averageMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAverageAuctionMembersTwodayAgo = async (req, res) => {
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

    // Sử dụng Mongoose để tính số lượng thành viên tham gia vào các phiên đấu giá trong hôm nay
    const totalMembers = await AuctionMember.countDocuments({
      timestamp: { $gte: startOfTwoDayAgo, $lt: endOfTwoDayAgo },
    }).exec();

    // Sử dụng Mongoose để lọc và đếm số phiên đấu giá mà có ít nhất một thành viên đăng ký trong ngày hôm nay
    const registeredAuctionCount = await AuctionMember.distinct("auction_id", {
      timestamp: { $gte: startOfTwoDayAgo, $lt: endOfTwoDayAgo },
    }).exec();

    // Tính số trung bình thành viên tham gia
    const averageMembers = totalMembers / registeredAuctionCount.length;

    res.json({ averageMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAuctionedAuctionCount = async (req, res, next) => {
  try {
    const statusAuction = "auctioned";
    const Count = await Auctions.countDocuments({
      status: statusAuction,
    }).exec(); // Đếm số lượng phiên đấu giá có trạng thái là status
    res.json({ Count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAuction = async (req, res, next) => {
  try {
    const auctionId = req.params.auctionId;

    // Tìm và cập nhật trạng thái sản phẩm
    const updatedProduct = await Auctions.findOneAndUpdate(
      { _id: auctionId },
      {
        $set: req.body,
      },
      { new: true }
    );

    // Kiểm tra xem sản phẩm có tồn tại và được cập nhật không
    if (updatedProduct) {
      // Sau khi phiên đấu giá được tạo, gọi hàm để lên lịch cập nhật trạng thái
      await scheduleAuctionStatusUpdates(
        updatedProduct,
        req.app.get("socketio")
      );

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(updatedProduct);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        message: "Auction not found or not updated.",
      });
    }
  } catch (err) {
    next(err);
  }
};
