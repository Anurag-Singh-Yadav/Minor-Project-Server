const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseTitle: {
    type: String,
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  branchCode: {
    type: String,
    // required: true,
  },
  internal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  deAllotted:{
    type: [Number],
  },
  oeAllotted:{
    type: [Number],
  },
});

module.exports = mongoose.model("Course-Details", courseSchema);
