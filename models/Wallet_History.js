const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const walletHistorySchema = new Schema(
  {
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    money_change: {
      type: mongoose.Types.Currency,
      required: true,
    },
    history_time: {
      type: Date,
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

var WalletHistory = mongoose.model("Wallet_History", walletHistorySchema);

module.exports = WalletHistory;
