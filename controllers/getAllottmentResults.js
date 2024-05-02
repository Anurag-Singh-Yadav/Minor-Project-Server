const branchSchema = require("../models/branchSchema");
const courseSchema = require("../models/courseSchema");
const studentBackgroundInfo = require("../models/studentBackgroundInfo");
const studentSchema = require("../models/studentSchema");

function padNumber(num) {
  let str = num.toString();
  return str.padStart(6, "0");
}

exports.getStudentInfo = async (req , res) => {
  try{
    const {rollNo} = req.body;

    const student = await studentBackgroundInfo.findOne({rollNo});

    return res.status(200).json({
      success:true,
      student,
    })

  }catch(err){
    console.log(err);

    return res.status(500).json({
      success:false,
      message:'Error while getting student',
    })
  }
}

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
    const course = await courseSchema.findOne({ courseCode });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const oeAllotted = [];
    const deAllotted = [];

    for (let i = 0; i < course.deAllotted.length; i++) {
      const student = await studentSchema.findOne({
        rollNo: course.deAllotted[i],
      });
      deAllotted.push({
        Roll_No: padNumber(student.rollNo),
        Name: student.name,
        Branch_Code: student.branchCode,
      });
    }

    for (let i = 0; i < course.oeAllotted.length; i++) {
      const student = await studentSchema.findOne({
        rollNo: course.oeAllotted[i],
      });
      oeAllotted.push({
        Roll_No: padNumber(student.rollNo),
        Name: student.name,
        Branch_Code: student.branchCode,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Allottment results fetched successfully",
      data: {
        course: course.courseCode,
        totalSeats: course.total,
        departmentAllotted: course.deAllotted.length,
        openElectiveAllotted: course.oeAllotted.length,
        totalSeatsAllotted: course.deAllotted.length + course.deAllotted.length,
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

    students.sort((a, b) => a.rollNo < b.rollNo);

    const data = [];

    for (let i = 0; i < students.length; i++) {
      const { rollNo, name, deAllotted, oeAllotted } = students[i];
      data.push({
        Roll: rollNo,
        Name: name,
        Department_Allotted: deAllotted.join(" "),
        Open_Elective_Allotted: oeAllotted.join(" "),
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


exports.getEveryCourse = async (req , res) => {
  try {
    const allCourses = await courseSchema.find({});

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
}