const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentBackgroundInfo = new Schema({
  name: {
    type: String,
  },
  branchCode:{
    type: String,
    required: true,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  rollNo: {
    type: Number,
    required: true,
    unique: true,
  },
  semester:{
    type:Number, 
  },
  gpa: {
    type: Number,
    required: true,
  },
  de: {
    type: Number,
    required: true,
  },
  oe: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Student-Background", studentBackgroundInfo);
