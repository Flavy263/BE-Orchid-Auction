const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

var User = mongoose.model("User", userSchema);

module.exports = User;
