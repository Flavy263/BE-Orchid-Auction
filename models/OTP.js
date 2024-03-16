const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const otpSendSchema = new Schema({
    user_mail: {
        type: String,
        required: true,
    },
    otp_code: {
        type: String,
        required: true,
    }
});

var OTP = mongoose.model("Otps", otpSendSchema);

module.exports = OTP;
