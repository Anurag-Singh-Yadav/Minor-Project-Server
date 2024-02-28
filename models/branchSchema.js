const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const branchSchema = new Schema({
  branchName: {
    type: String,
  },
  branchStrength: {
    type: Number,
    required: true,
  },
  branchCode: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Branch-Details", branchSchema);
