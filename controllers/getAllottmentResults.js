const branchSchema = require("../models/branchSchema");
const courseSchema = require("../models/courseSchema");
const studentSchema = require("../models/studentSchema");

exports.getAllBranches = async (req, res) => {
  try {
    const allBranches = await branchSchema.find({});

    return res.status(200).json({
      success: true,
      message: "All branches fetched successfully.",
      data: allBranches,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching branches.",
      error: err,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  const { branchCode } = req.body;
  try {
    const allCourses = await courseSchema.find({ branchCode });

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully.",
      data: allCourses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses.",
      error: err,
    });
  }
};

exports.getCourseWiseAllottment = async (req, res) => {
  const { courseCode } = req.body;
  try {
    console.log(courseCode);
    const course = await courseSchema.findOne({ courseCode });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const data = {
      Course: course.courseCode,
      Total_Seats: course.total,
      Department_Allotted: course.deAllotted.length,
      openElectiveAllotted: course.oeAllotted.length,
      totalSeatsAllotted: course.deAllotted.length + course.deAllotted.length,
      de: {
        rollNo:[],
        name:[],
        branchCode:[],
      },
      oe: {
        rollNo:[],
        name:[],
        branchCode:[],
      },
    }

    console.log(course);

    for (let i = 0; i < course.deAllotted.length; i++) {
      const student = await studentSchema.findOne({
        rollNo: course.deAllotted[i],
      });
      const {rollNo , name , branchCode} = student;
      data.de.rollNo.push(rollNo);
      data.de.name.push(name);
      data.de.branchCode.push(branchCode);
    }

    for (let i = 0; i < course.oeAllotted.length; i++) {
      const student = await studentSchema.findOne({
        rollNo: course.oeAllotted[i],
      });
      const {rollNo , name , branchCode} = student;
      data.oe.rollNo.push(rollNo);
      data.oe.name.push(name);
      data.oe.branchCode.push(branchCode);
    }

    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching allottment.",
      error: err,
    });
  }
};

exports.getAllottmentBranchWise = async (req, res) => {
  const { branchCode } = req.body;
  if (!branchCode)
    return res.status(400).json({
      success: false,
      message: "Branch code not found",
    });
  try {
    const students = await studentSchema.find({ branchCode });

    students.sort((a, b) => a.rollNo < b.rollNo);

    const data = [];

    for(let i = 0 ; i < students.length; i++) {
      const {rollNo , name , deAllotted , oeAllotted} = students[i];
      data.push({
        Roll: rollNo,
        Name: name,
        Department_Allotted: deAllotted.join(' '),
        Open_Elective_Allotted: oeAllotted.join(' '),
      });
    }

    return res.status(200).json({
      success: true,
      message: "All students fetched successfully",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching students allottment results",
      error: err,
    });
  }
};
