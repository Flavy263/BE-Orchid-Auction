const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const auctionSchema = new Schema(
  {
    minimum_price_step: {
      type: mongoose.Types.Currency,
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
      type: Boolean,
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
  },
  {
    timestamps: true,
  }
);

var Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
