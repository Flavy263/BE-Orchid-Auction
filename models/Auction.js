const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const auctionSchema = new Schema({
  price_step: {
    type: Number,
    required: true,
  },
  starting_price: {
    type: Number,
    required: true,
  },
  auctionInfo: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  regitration_start_time: {
    type: Date,
    required: true,
  },
  regitration_end_time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  host_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

var Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
