const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const configSchema = new Schema(
  {
    type_config: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    money: {
      type: mongoose.Types.Currency,
      required: true,
    }
  });

var Config = mongoose.model("Config", configSchema);

module.exports = Config;
