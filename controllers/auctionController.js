const moment = require("moment");
const schedule = require("node-schedule");
const Auctions = require("../models/Auction");
const socketIo = require("socket.io");
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
  const startTime = moment(start_time).format("YYYY-MM-DD HH:mm:ss");
  const endTime = moment(end_time).format("YYYY-MM-DD HH:mm:ss");
  const regitrationStartTime = moment(regitration_start_time).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  const regitrationEndTime = moment(regitration_end_time).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  // Kiểm tra và cập nhật trạng thái khi qua mốc thời gian
  schedule.scheduleJob(startTime, async () => {
    await updateAuctionStatus(_id, "not yet auctioned", io);
  });

  schedule.scheduleJob(endTime, async () => {
    await updateAuctionStatus(_id, "about to auction", io);
  });

  schedule.scheduleJob(regitrationStartTime, async () => {
    await updateAuctionStatus(_id, "auctioning", io);
  });

  schedule.scheduleJob(regitrationEndTime, async () => {
    await updateAuctionStatus(_id, "auctioned", io);
  });
}
exports.getAllAuction = (req, res, next) => {
  Auctions.find()
    .populate("host_id", "fullName")
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

exports.createAuction = (req, res, next) => {
  Auctions.create(req.body)
    .then(
      async (auction) => {
        console.log("Auction Created ", auction);

        // Sau khi phiên đấu giá được tạo, gọi hàm để lên lịch cập nhật trạng thái
        await scheduleAuctionStatusUpdates(auction, req.app.get("socketio"));

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(auction);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

exports.getAuctionByID = (req, res, next) => {
  Auctions.findById(req.params.auctionId).populate("product_id")
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
  Auctions.find({ host_id: req.params.host_id, status: "not yet auctioned" }).populate("host_id", "fullName")
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
  Auctions.find({ host_id: req.params.host_id, status: "about to auction" }).populate("host_id", "fullName")
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
  Auctions.find({ host_id: req.params.host_id, status: "auctioning" }).populate("host_id", "fullName")
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
  Auctions.find({ host_id: req.params.host_id, status: "auctioned" }).populate("host_id", "fullName")
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
