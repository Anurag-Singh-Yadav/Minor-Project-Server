const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
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
  dePreference: { type: [String] },
  oePreference: { type: [String] },
  deAllotted: { type: [String] },
  oeAllotted: { type: [String] },
});

module.exports = mongoose.model("Students", studentSchema);
