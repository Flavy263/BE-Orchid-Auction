const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const configSchema = new Schema(
  {
    type_config: {
      type: String,
      required: true,
    },
    //"Join in auction" - "Register auction"
    description: {
      type: String,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    }
  });

var Config = mongoose.model("Config", configSchema);

module.exports = Config;
