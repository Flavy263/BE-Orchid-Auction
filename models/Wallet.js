const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const walletSchema = new Schema(
  {    
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ballance: {
      type: mongoose.Types.Currency,
      required: true,      
    },
  },
  {
    timestamps: true,
  }
);

var Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
