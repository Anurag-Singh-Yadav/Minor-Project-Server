const express = require("express");
const {
  overWriteStudentDetails,
  overWriteBranchDetails,
  overWriteCourseDetails,
  addStudents,
  addCourse,
  addBranch,
  oneTime,
  addStudentPreference,
} = require("../controllers/updateDetails");
const {
  allocateDepartmentElectives,
  allocateOpenElectives,
  clearDEAllottment,
  clearOEAllottment,
  clearAllotments,
  allotDE,
  allotOE,
} = require("../controllers/allocateProcess");

const router = express.Router();


// update data required for allocation processes.
router.post("/overwrite-student-details", overWriteStudentDetails);
router.post("/overwrite-branch-details", overWriteBranchDetails);
router.post("/overwrite-course-details", overWriteCourseDetails);
router.post("/add-students", addStudents);
router.post("/add-courses", addCourse);
router.post("/add-branch", addBranch);
router.post('/one-time' , oneTime);

// allocation process
router.post("/allocate-electives", allocateDepartmentElectives , allocateOpenElectives);
router.post('/clear-department-allottment' , clearDEAllottment);
router.post('/clear-open-electives', clearOEAllottment);
router.post('/clear-all-allottments' , clearAllotments);
router.post('/de-allottment' , allotDE);
router.post('/oe-allottment' , allotOE);
router.post('/add-student-preference' , addStudentPreference);
module.exports = router;