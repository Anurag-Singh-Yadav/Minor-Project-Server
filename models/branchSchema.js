const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const branchSchema = new Schema({
  branchName: {
    type: String,
  },
  branchStrength:{
    type:Number,
  },
  branchCode: {
    type: Number,
    required: true,
    unique: true,
  },
  gpa: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Branch-Details", branchSchema);
