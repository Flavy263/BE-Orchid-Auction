// controllers/auctionController.js

const Auction = require("../models/Auction");
const AuctionBid = require("../models/Auction_Bid");
const moment = require("moment");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const AuctionMember = require("../models/Auction_Member");

exports.handleCheckPrice = async (priceStep, customerPrice, auctionPrice) => {
  try {
    if (customerPrice <= auctionPrice || customerPrice % priceStep != 0) {
      return false;
    }
    return true;
  } catch (error) {}
};

// Handle new bid
exports.handleNewBid = async (req, res) => {
  try {
    const { auctionId, customerId } = req.params; // Lấy auctionId và customerId từ params
    const { price } = req.body; // Lấy price từ req.body
    const auction = await Auction.findById(auctionId);
    const customer = await User.findById(customerId);
    const auctionBid = await AuctionBid.find({ auction_id: auctionId });
    const customerWallet = await Wallet.find({ user_id: customerId });
    if (!auctionBid) {
      throw new Error("AuctionBid not found");
    }
    if (!auction) {
      throw new Error("Auction not found");
    }

    // Check if the current time is within the registration period
    const currentTime = moment();
    const registrationEndTime = moment(auction.registration_end_time);

    if (currentTime.isAfter(registrationEndTime)) {
      throw new Error("Bidding registration period has ended");
    }

    // viết hàm await giúp tui tìm giá tiền lớn nhất ở bản AuctionBid dựa trên auctionId và chỉ trề maxPrice có biên let maxPrice
    // và dùng maxPrice này ràng vào this.handleFindMaxPrice(auctionBid.price)
    // kiểm tra xem số tiền có phải bội của bước giá hay không
    const maxBid = await AuctionBid.findOne({ auction_id: auctionId }).sort({
      price: -1,
    });

    // const maxPrice = maxBid ? maxBid.price : 0;
    // console.log("maxPid", maxBid);
    if (price <= maxBid.price) {
      throw new Error(
        `Không dc nhập số tiền nhỏ hơn hoặc bằng ${maxBid.price}`
      );
    }
    // Kiểm tra xem giá mới có phải là bội của bước giá không
    if ((price - maxBid.price) % auction.price_step !== 0) {
      throw new Error("Price is not a multiple of the price step");
    }

    const newBid = new AuctionBid({
      auction_id: auctionId,
      customer_id: customerId,
      price,
      create_time: new Date(),
    });

    await newBid.save();
    req.app.get("socketio").emit("bidAccepted", newBid);
    res
      .status(200)
      .json({ success: true, message: "Bid accepted successfully" });
  } catch (error) {
    req.app.get("socketio").emit("bidRejected", { error: error.message });
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.handleFindMaxPrice = async (req, res, next) => {
  try {
    const auctionId = req.params.auctionId; // Lấy auctionId từ request parameters
    const maxPriceAuctionBids = await AuctionBid.aggregate([
      {
        $match: { auction_id: mongoose.Types.ObjectId(auctionId) }, // Lọc dữ liệu cho auction_id cụ thể
      },
      {
        $sort: { price: -1, create_time: -1 }, // Sắp xếp giảm dần theo price và create_time
      },
      {
        $group: {
          _id: "$auction_id",
          maxPriceAuctionBid: { $first: "$$ROOT" }, // Lấy bản ghi đầu tiên sau khi sắp xếp
        },
      },
      {
        $replaceRoot: { newRoot: "$maxPriceAuctionBid" }, // Chọn lại định dạng root cho kết quả
      },
    ]);
    res.status(200).json(maxPriceAuctionBids); // Trả về kết quả
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" }); // Trả về lỗi nếu có
  }
};

exports.getAuctionBidSortDes = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;

    // Sử dụng Mongoose để lấy tất cả auction_bid của auction đó và sắp xếp theo giảm dần của giá
    const auctionBids = await AuctionBid.find({ auction_id: auctionId })
      .sort({ price: -1 }) // Sắp xếp theo giảm dần của giá
      .exec();
    if (auctionBids.length > 1) {
      auctionBids.pop(); // Loại bỏ bản ghi cuối cùng, có giá nhỏ nhất
    }

    res.json(auctionBids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMemberDoNotBid = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;

    // Find members who participated in the auction
    const auctionMembers = await AuctionMember.find({ auction_id: auctionId });

    // Find members who placed bids in the auction
    const auctionBids = await AuctionBid.find({ auction_id: auctionId });

    // Extract member IDs from auctionBids
    const bidMemberIds = auctionBids.map((bid) => bid.customer_id);

    // Filter out members who placed bids from auctionMembers
    const membersWithoutBids = auctionMembers.filter(
      (member) => !bidMemberIds.includes(member.member_id)
    );

    res.json({ membersWithoutBids });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAuctionHaveMemberDoNotBid = async (req, res) => {
  try {
    const { host_id } = req.query;

    // Lấy tất cả các auction_id từ bảng AuctionMember cho host_id chỉ định
    const auctionMembers = await AuctionMember.distinct("auction_id", {
      host_id,
    }).exec();

    // Lấy tất cả các auction_id từ bảng AuctionBid
    const auctionBids = await AuctionBid.distinct("auction_id").exec();

    // Lọc ra các auction_id có trong AuctionMember nhưng không có trong AuctionBid
    const unbidAuctionIds = auctionMembers.filter(
      (auctionId) => !auctionBids.includes(auctionId)
    );

    const mapAuctions = await Promise.all(
      unbidAuctionIds.map((e) => {
        return Auction.findById(e).exec(); // Trả về một Promise
      })
    );

    // Kiểm tra nếu không có auction_id nào thoả mãn điều kiện, trả về mảng rỗng
    if (mapAuctions.length === 0) {
      res.json({ mapAuctions: [] });
    } else {
      res.json({ mapAuctions });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUnregisteredAuction = async (req, res) => {
  try {
    const hostId = req.params.host_id; // Lấy host_id từ request

    // Lấy tất cả các cuộc đấu giá của host cụ thể
    const auctions = await Auction.find({ host_id: hostId }).exec();

    // Lấy tất cả các auction_id đã được đăng ký tham gia đấu giá của host cụ thể
    const registeredAuctionIds = await AuctionMember.find({ host_id: hostId })
      .distinct("auction_id")
      .exec();

    // Lọc ra các auction_id của host cụ thể mà không có người đăng ký tham gia
    const unregisteredAuctionIds = auctions
      .filter(
        (auction) => !registeredAuctionIds.includes(auction._id.toString())
      )
      .map((auction) => auction._id);

    // Kiểm tra nếu không có auction_id nào thoả mãn điều kiện, trả về mảng rỗng
    if (unregisteredAuctionIds.length === 0) {
      res.json({ unregisteredAuctionIds: [] });
    } else {
      res.json({ unregisteredAuctionIds });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const handleNewBid = async () => {
//   try {
//     // Thực hiện các kiểm tra cần thiết trước khi gửi yêu cầu đặt giá mới, nếu có
//     const response = await fetch('http://localhost:3001/bid', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         auctionId: 'auction_id_here', // Thay 'auction_id_here' bằng ID thực tế của phiên đấu giá
//         customer_id: 'customer_id_here', // Thay 'customer_id_here' bằng ID thực tế của người dùng đặt giá
//         price: 100, // Thay 100 bằng giá tiền mới cần đặt
//       }),
//     });

//     const data = await response.json();

//     if (data.success) {
//       console.log('Bid placed successfully');
//       // Không cần cập nhật giao diện ở đây, thông qua sự kiện từ Socket.IO, giao diện sẽ được cập nhật tự động
//     } else {
//       console.error('Failed to place bid:', data.error);
//       // Xử lý thông báo lỗi nếu cần
//     }
//   } catch (error) {
//     console.error('Error placing bid:', error.message);
//     // Xử lý lỗi nếu cần
//   }
// };

// import React, { useState, useEffect } from 'react';
// import socketIOClient from 'socket.io-client';
// import BidItem from './BidItem';

// const AuctionDetails = ({ auction }) => {
//   const [bids, setBids] = useState(auction.bids);

//   useEffect(() => {
//     const socket = socketIOClient('http://localhost:3001'); // Thay đổi URL tương ứng với máy chủ Socket.IO của bạn

//     socket.on('bidAccepted', newBid => {
//       setBids(prevBids => [...prevBids, newBid]);
//     });

//     socket.on('bidRejected', error => {
//       console.log('Bid Rejected:', error);
//       // Xử lý thông báo lỗi nếu cần
//     });

//     return () => socket.disconnect();
//   }, []);

// return (
//   <div className="auction-details">
//     <h2>Auction Details</h2>
//     <p>Auction ID: {auction._id}</p>
//     <h3>Bids:</h3>
//     <div className="bids-list">
//       {bids.map((bid, index) => (
//         <BidItem key={index} bid={bid} />
//       ))}
//     </div>
//     <button onClick={handleNewBid}>Place New Bid</button>
//   </div>
// );
// };

// -------------------------------
// const handleNewBid = async () => {
//   try {
//     // Thực hiện các kiểm tra cần thiết trước khi gửi yêu cầu đặt giá mới, nếu có
//     const token = 'your_token_here'; // Thay 'your_token_here' bằng token xác thực thực tế

//     const response = await axios.post('http://localhost:3001/bid', {
//       auctionId: 'auction_id_here', // Thay 'auction_id_here' bằng ID thực tế của phiên đấu giá
//       customer_id: 'customer_id_here', // Thay 'customer_id_here' bằng ID thực tế của người dùng đặt giá
//       price: 100, // Thay 100 bằng giá tiền mới cần đặt
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     const data = response.data;

//     if (data.success) {
//       console.log('Bid placed successfully');
//       // Không cần cập nhật giao diện ở đây, thông qua sự kiện từ Socket.IO, giao diện sẽ được cập nhật tự động
//     } else {
//       console.error('Failed to place bid:', data.error);
//       // Xử lý thông báo lỗi nếu cần
//     }
//   } catch (error) {
//     console.error('Error placing bid:', error.message);
//     // Xử lý lỗi nếu cần
//   }
// };
