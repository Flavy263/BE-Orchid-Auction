// controllers/auctionController.js

const Auction = require('../models/auctionModel');
const AuctionBid = require('../models/auctionBidModel');
const moment = require('moment');

// Handle new bid
exports.handleNewBid = async (req, res) => {
  try {
    const { auctionId } = req.params; // Lấy auctionId từ params

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    // Check if the current time is within the registration period
    // const currentTime = moment();
    // const registrationEndTime = moment(auction.regitration_end_time);

    const currentTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // Lấy thời gian hiện tại với định dạng ngày và giờ
  
    // Tạo đối tượng thời gian từ chuỗi `auction.registration_end_time` với định dạng mong muốn
    const registrationEndTime = moment(auction.registration_end_time, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    
    if (currentTime.isAfter(registrationEndTime)) {
      throw new Error('Bidding registration period has ended');
    }

    const { customer_id, price } = req.body; // Lấy customer_id và price từ req.body

    // Save the new bid
    const newBid = new AuctionBid({
      auction_id: auctionId, // Sử dụng auctionId lấy từ params
      customer_id,
      price,
      create_time: new Date(),
    });
    await newBid.save();

    // Emit an event to notify clients about the new bid
    req.app.get('socketio').emit('bidAccepted', newBid);
    res.status(200).json({ success: true, message: 'Bid accepted successfully' });
  } catch (error) {
    // Emit an event to notify clients about the error
    req.app.get('socketio').emit('bidRejected', { error: error.message });
    res.status(400).json({ success: false, error: error.message });
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


