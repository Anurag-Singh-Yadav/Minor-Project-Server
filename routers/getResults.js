const express = require("express");
const router = express.Router();

const {
  getAllBranches,
  getAllCourses,
  getCourseWiseAllottment,
  getAllottmentBranchWise,
} = require("../controllers/getAllottmentResults");

router.get("/all-branches", getAllBranches);

router.post("/all-courses", getAllCourses);

router.post("/course-wise-allottment", getCourseWiseAllottment);

router.post("/branch-wise-allottment", getAllottmentBranchWise);

module.exports = router;
