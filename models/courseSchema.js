const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseTitle: {
    type: String,
  },
  courseCode: {
    type: Number,
    required: true,
    unique: true,
  },
  branchCode: {
    type: String,
    required: true,
  },
  internal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  deAlloted:{
    type: [Number],
    required: true,
  },
  oeAlloted:{
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model("Course-Details", courseSchema);
