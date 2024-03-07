const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const walletRequestSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type_report: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }
);

var WalletRequest = mongoose.model("Wallet_Request", walletRequestSchema);

module.exports = WalletRequest;
