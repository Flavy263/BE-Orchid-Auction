const moment = require("moment");
const schedule = require("node-schedule");
const Auctions = require("../models/Auction");
const Orders = require("../models/Order");
const socketIo = require("socket.io");
const Product = require("../models/Product");
const Wallets = require("../models/Wallet");
const WalletHistorys = require("../models/Wallet_History");
const Config = require("../models/Config");

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
async function updateAuctionStatus(auctionId, newStatus, io) {
  try {
    const updatedAuction = await Auctions.findByIdAndUpdate(
      auctionId,
      { status: newStatus },
      { new: true }
    );
    console.log(`Updated status of auction ${auctionId} to ${newStatus}`);
    if (io) {
      io.emit("auction_status_changed", { auctionId, newStatus });
    } else {
      console.error("Socket connection is undefined");
    }
  } catch (error) {
    console.error(`Error updating auction status: ${error.message}`);
  }
}

// Schedule để cập nhật trạng thái phiên đấu giá
// function scheduleAuctionStatusUpdates(auction, io) {
//   const { _id, start_time, end_time, registration_start_time, registration_end_time } = auction;
//   const startTime = moment(start_time).format("YYYY-MM-DD HH:mm:ss");
//   const endTime = moment(end_time).format("YYYY-MM-DD HH:mm:ss");
//   const registrationStartTime = moment(registration_start_time).format("YYYY-MM-DD HH:mm:ss");
//   const registrationEndTime = moment(registration_end_time).format("YYYY-MM-DD HH:mm:ss");
//   // Kiểm tra và cập nhật trạng thái khi qua mốc thời gian
//   schedule.scheduleJob(startTime, async () => {
//     await updateAuctionStatus(_id, 'not yet auctioned', io);
//   });

//   schedule.scheduleJob(endTime, async () => {
//     await updateAuctionStatus(_id, 'about to auction', io);
//   });

//   schedule.scheduleJob(registrationStartTime, async () => {
//     await updateAuctionStatus(_id, 'auctioning', io);
//   });

//   schedule.scheduleJob(registrationEndTime, async () => {
//     await updateAuctionStatus(_id, 'auctioned', io);
//   });
// }

// Schedule để cập nhật trạng thái phiên đấu giá
function scheduleAuctionStatusUpdates(auction, io) {
  const {
    _id,
    start_time,
    end_time,
    regitration_start_time,
    regitration_end_time,
  } = auction;
  // const startTime = moment(start_time).format("YYYY-MM-DD HH:mm:ss");
  // const endTime = moment(end_time).format("YYYY-MM-DD HH:mm:ss");
  // const regitrationStartTime = moment(regitration_start_time).format(
  //   "YYYY-MM-DD HH:mm:ss"
  // );
  // const regitrationEndTime = moment(regitration_end_time).format(
  //   "YYYY-MM-DD HH:mm:ss"
  // );
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

    const wallet = await Wallets.findOne({ user_id: req.body.host_id });
    if (!wallet) {
      return res.status(400).json({ error: "User has no wallet!" });
    }
    const config = await Config.findOne({ type_config: "Create auction" });
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
    console.log(bidAmount);

    // Ghi lịch sử vào WalletHistory
    const walletHistory = new WalletHistorys({
      wallet_id: wallet._id,
      amount: bidAmount,
      type: "withdraw",
    });
    await walletHistory.save();
    console.log(walletHistory);
    const auction = await Auctions.create(req.body);

    console.log("Auction Created ", auction);

    // Tìm và cập nhật trạng thái sản phẩm
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product_id },
      { $set: { status: true } },
      { new: true }
    );

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

const AuctionMember = require("../models/Auction_Member");

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
        console.log("Order Created ", order);
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

exports.getOrderByMemberID = (req, res, next) => {
  Orders.find({ winner_id: req.params.memberId })
    .then(
      (order) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getOrderByHostID = (req, res, next) => {
  Orders.find({ host_id: req.params.hostId })
    .then(
      (order) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
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
      const auctionStatus = auctionMember.auction_id.status;
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
        registration_start_time: auction.registration_start_time,
        registration_end_time: auction.registration_end_time,
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
    console.log(resultAuctions);
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

    // Lọc các đấu giá theo status
    const filteredAuctions = registeredAuctions.filter((auctionMember) => {
      const auctionStatus = auctionMember.auction_id.status;
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
        registration_start_time: auction.registration_start_time,
        registration_end_time: auction.registration_end_time,
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
    console.log(resultAuctions);
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
      const auctionStatus = auctionMember.auction_id.status;
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
        registration_start_time: auction.registration_start_time,
        registration_end_time: auction.registration_end_time,
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
    console.log(resultAuctions);
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
      const auctionStatus = auctionMember.auction_id.status;
      // Điều kiện lọc theo status, bạn có thể thay đổi tùy theo yêu cầu
      return auctionStatus === "auctioned";
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
        registration_start_time: auction.registration_start_time,
        registration_end_time: auction.registration_end_time,
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
    console.log(resultAuctions);
    res.status(200).json(resultAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
