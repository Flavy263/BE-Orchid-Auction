const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const roleSchema = new Schema(
  {    
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      
    },
  },
  {
    timestamps: true,
  }
);

var Role = mongoose.model("Role", roleSchema);

module.exports = Role;
