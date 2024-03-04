const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const auctionBidSchema = new Schema(
  {
    auction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: mongoose.Types.Currency,
      required: true,
    },
    creat_time: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var AuctionBid = mongoose.model("Auction_Bid", auctionBidSchema);

module.exports = AuctionBid;
