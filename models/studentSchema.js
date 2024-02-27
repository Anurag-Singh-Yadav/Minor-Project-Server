const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
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
  branchCode: {
    type: String,
    required: true,
  },
  de: {
    type: Number,
    required: true,
  },
  ge: {
    type: Number,
    required: true,
  },
  dePreference: { type: [String] },
  gePreference: { type: [String] },
});

module.exports = mongoose.model("Students", studentSchema);
