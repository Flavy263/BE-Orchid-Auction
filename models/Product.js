const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  video: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

var Product = mongoose.model("Product", productSchema);

module.exports = Product;