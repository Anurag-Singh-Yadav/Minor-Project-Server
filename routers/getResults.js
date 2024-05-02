const express = require("express");
const router = express.Router();

const {
  getAllBranches,
  getAllCourses,
  getCourseWiseAllottment,
  getAllottmentBranchWise,
  getEveryCourse,
  getStudentInfo,
} = require("../controllers/getAllottmentResults");

router.get("/all-branches", getAllBranches);

router.post("/all-courses", getAllCourses);

router.get("/every-course", getEveryCourse);

router.get('/student-info' , getStudentInfo);

router.post("/course-wise-allottment", getCourseWiseAllottment);

router.post("/branch-wise-allottment", getAllottmentBranchWise);

module.exports = router;
