const express = require("express");
const {
  overWriteStudentDetails,
  overWriteBranchDetails,
  overWriteCourseDetails,
  addStudents,
  addCourse,
  addBranch,
} = require("../controllers/updateDetails");
const {
  allocateDepartmentElectives,
  allocateOpenElectives,
  clearDEAllottment,
  clearOEAllottment,
  clearAllotments,
} = require("../controllers/allocateProcess");

const router = express.Router();


// update data required for allocation processes.
router.post("/overwrite-student-details", overWriteStudentDetails);
router.post("/overwrite-branch-details", overWriteBranchDetails);
router.post("/overwrite-course-details", overWriteCourseDetails);
router.post("/add-students", addStudents);
router.post("/add-courses", addCourse);
router.post("/add-branch", addBranch);



// allocation process
router.post("/allocate-department-electives", allocateDepartmentElectives);
router.post("/allocate-open-electives", allocateOpenElectives);
router.post('/clear-department-allottment' , clearDEAllottment);
router.post('/clear-open-electives', clearOEAllottment);
router.post('/clear-all-allotments' , clearAllotments);

module.exports = router;