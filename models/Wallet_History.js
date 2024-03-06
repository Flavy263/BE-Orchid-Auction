const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const walletHistorySchema = new Schema({
  wallet_id: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String, // 'deposit' or 'withdraw'
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

var WalletHistory = mongoose.model("Wallet_History", walletHistorySchema);

module.exports = WalletHistory;
