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
    money_request: {
      type: mongoose.Types.Currency,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var WalletRequest = mongoose.model("Wallet_Request", walletRequestSchema);

module.exports = WalletRequest;
