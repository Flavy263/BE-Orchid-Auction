const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
var passportLocalMongoose = require('passport-local-mongoose');

const otpSchema = new Schema(
    {
        user_mail: {
            type: String,
            required: true,
        },
        otp_code: {
            type: String,
            required: true,
        }
    },
);

otpSchema.plugin(passportLocalMongoose);

var OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
