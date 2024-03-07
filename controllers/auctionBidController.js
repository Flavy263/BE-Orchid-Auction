// controllers/auctionController.js

const Auction = require('../models/Auction');
const AuctionBid = require('../models/Auction_Bid');
const moment = require('moment');
const User = require('../models/User');
const Wallet = require('../models/Wallet')

exports.handleCheckPrice = async (priceStep, customerPrice, auctionPrice, customerWallet) => {
  try {
    if (customerPrice <= auctionPrice || customerPrice % priceStep != 0 || customerWallet < auctionPrice) {
      return false;
    }
    return true;
  } catch (error) {

  }
}

// Handle new bid
exports.handleNewBid = async (req, res) => {
  try {
    const { auctionId, customerId } = req.params; // Lấy auctionId và customerId từ params
    const { price } = req.body; // Lấy price từ req.body

    const auction = await Auction.findById(auctionId);
    const customer = await User.findById(customerId);
    const auctionBid = await AuctionBid.findById(auctionId);
    const customerWallet = await Wallet.find({ user_id: customerId })
    if (!auction) {
      throw new Error('Auction not found');
    }

    // Check if the current time is within the registration period
    const currentTime = moment();
    const registrationEndTime = moment(auction.registration_end_time);

    if (currentTime.isAfter(registrationEndTime)) {
      throw new Error('Bidding registration period has ended');
    }

    // kiểm tra xem số tiền có phải bội của bước giá hay không
    if (!this.handleCheckPrice(auction.price_step, price, auctionBid.price, customerWallet.balance)) {
      throw new Error('Price is not a multiple of the price step');
    }

    const newBid = new AuctionBid({
      auction_id: auctionId,
      customer_id: customerId,
      price,
      create_time: new Date(),
    });

    await newBid.save();
    req.app.get('socketio').emit('bidAccepted', newBid);
    res.status(200).json({ success: true, message: 'Bid accepted successfully' });

  } catch (error) {
    req.app.get('socketio').emit('bidRejected', { error: error.message });
    res.status(400).json({ success: false, error: error.message });
  }
};

const AuctionBid = require('./auctionBidModel'); // Import model

exports.handleFindMaxPrice = async (req, res, next) => {
  try {
    const auctionId = req.params.auctionId; // Lấy auctionId từ request parameters
    const maxPriceAuctionBids = await AuctionBid.aggregate([
      {
        $match: { auction_id: mongoose.Types.ObjectId(auctionId) } // Lọc dữ liệu cho auction_id cụ thể
      },
      {
        $sort: { price: -1, create_time: -1 } // Sắp xếp giảm dần theo price và create_time
      },
      {
        $group: {
          _id: "$auction_id",
          maxPriceAuctionBid: { $first: "$$ROOT" } // Lấy bản ghi đầu tiên sau khi sắp xếp
        }
      },
      {
        $replaceRoot: { newRoot: "$maxPriceAuctionBid" } // Chọn lại định dạng root cho kết quả
      }
    ]);
    res.status(200).json(maxPriceAuctionBids); // Trả về kết quả
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' }); // Trả về lỗi nếu có
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


