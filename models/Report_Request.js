const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const reportRequestSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type_report: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  note: {
    type: String
  },
  status: {
    type: Boolean,
    default: true,
  },
  create_timestamp: {
    type: Date,
    default: Date.now,
  },
  update_timestamp: {
    type: Date,
  },
});

var ReportRequest = mongoose.model("Report_Request", reportRequestSchema);

module.exports = ReportRequest;
