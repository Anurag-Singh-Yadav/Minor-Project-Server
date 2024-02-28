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
    const course = await courseSchema.find({ courseCode });

    const oeAllotted = [];
    const deAllotted = [];

    for (let i = 0; i < course.deAllotted.length; i++) {
      const student = await studentSchema.findOne({
        rollNo: course.deAllotted[i],
      });
      deAllotted.push(student);
    }

    for (let i = 0; i < oeAllotted.length; i++) {
      const student = await studentSchema.findOne({
        rollNo: course.oeAllotted[i],
      });
      oeAllotted.push(student);
    }

    return res.status(200).json({
      success: true,
      message: "Allottment results fetched successfully",
      data: {
        ...course.toObject(),
        deAllotted,
        oeAllotted,
      },
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

    students.sort((a , b) => a.rollNo < b.rollNo);

    return res.status(200).json({
        success:true,
        message:'All students fetched successfully',
        data:students,
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
