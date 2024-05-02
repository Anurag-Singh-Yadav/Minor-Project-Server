const branchSchema = require("../models/branchSchema");
const courseSchema = require("../models/courseSchema");
const studentBackgroundInfo = require("../models/studentBackgroundInfo");
const studentSchema = require("../models/studentSchema");
const mongoose = require("mongoose");

exports.addStudentPreference = async (req, res) => {
  const { data } = req.body;

  try {
    const student = await studentSchema.findOneAndUpdate(
      {
        rollNo: data.rollNo,
      },
      data
    );
    return res.status(200).json({
      success:true,
      data:student,
    })
  } catch (err) {
    return res.status(500).json({
      success:false,
      message: 'Internal server error while addding student',
    })
  }
};

exports.overWriteStudentDetails = async (req, res) => {
  const { studentDetails } = req.body;

  if (!studentDetails) {
    return res.status(404).json({
      success: false,
      message: "Student details not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await studentSchema.deleteMany({}, { session });
    const students = studentDetails.map(
      ({
        branchCode,
        gpa,
        name,
        de,
        oe,
        isFree,
        rollNo,
        oePreference,
        dePreference,
      }) => ({
        branchCode,
        gpa,
        name,
        de,
        oe,
        isFree,
        rollNo,
        oePreference,
        dePreference,
      })
    );

    await studentSchema.insertMany(students, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Student details updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Error occured while overwriting student details",
      error: err,
    });
  }
};

exports.overWriteBranchDetails = async (req, res) => {
  const { branchDetails } = req.body;
  console.log("branchDetails", branchDetails);
  if (!branchDetails) {
    return res.status(404).json({
      success: false,
      message: "Branch details not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await branchSchema.deleteMany({}, { session });

    const branches = branchDetails.map(
      ({ branchName, branchCode, branchStrength }) => ({
        branchName,
        branchCode,
        branchStrength,
      })
    );

    await branchSchema.insertMany(branches, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Branch details updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Error occured while overwriting branch details",
      error: err,
    });
  }
};

exports.overWriteCourseDetails = async (req, res) => {
  const { courseDetails } = req.body;

  if (!courseDetails) {
    return res.status(404).json({
      success: false,
      message: "Course details not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await courseSchema.deleteMany({}, { session });

    const courses = courseDetails.map(
      ({
        branchCode,
        courseCode,
        courseTitle,
        deAlloted,
        internal,
        oeAlloted,
        total,
      }) => ({
        branchCode,
        courseCode,
        courseTitle,
        deAlloted,
        internal,
        oeAlloted,
        total,
      })
    );

    await courseSchema.insertMany(courses, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Course details updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Error occured while overwriting course details",
      error: err,
    });
  }
};

function generateRandomGPA() {
  return (Math.random() * (10.0 - 5.5) + 5.5).toFixed(2);
}

function generateRandomMarks() {
  return Math.floor(Math.random() * (2 - 1 + 1)) + 1;
}

function generateOEPreference(branchCode) {
  const otherBranches = [
    "CS",
    "IT",
    "ECE",
    "EE",
    "ME",
    "CE",
    "CHE",
    "BT",
    "TE",
    "IPE",
    "ICE",
  ].filter((branch) => branch !== branchCode);
  const subjects = otherBranches.map(
    (otherBranch) => `${otherBranch}${"10"}${Math.floor(Math.random() * 3) + 1}`
  );
  return subjects;
}

function generateDEPreference(branchCode) {
  return [`${branchCode}101`, `${branchCode}102`, `${branchCode}103`];
}

function getStudents() {
  const studentData = [];
  let j = 1;
  const branches = [
    "CS",
    "IT",
    "EC",
    "EE",
    "ME",
    "CE",
    "CH",
    "BT",
    "TT",
    "IP",
    "IC",
  ];
  for (const branch of branches) {
    for (let i = 1; i <= 10; i++) {
      const student = {
        name: `${branch} Student${i}`,
        rollNo: j,
        branchCode: branch,
        gpa: generateRandomGPA(),
        oe: generateRandomMarks(),
        de: generateRandomMarks(),
        dePreference: generateDEPreference(branch),
        oePreference: generateOEPreference(branch),
      };
      j++;
      studentData.push(student);
    }
  }
  return studentData;
}

exports.addStudents = async (req, res) => {
  const students = getStudents();

  if (!students) {
    return res.status(404).json({
      success: false,
      message: "Student details not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const studentsData = students.map(
      ({
        branchCode,
        gpa,
        name,
        de,
        oe,
        isFree,
        rollNo,
        oePreference,
        dePreference,
      }) => ({
        branchCode,
        gpa,
        name,
        de,
        oe,
        isFree,
        rollNo,
        oePreference,
        dePreference,
      })
    );
    await studentSchema.insertMany(studentsData, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Student details updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Error occured while adding student details",
      error: err,
    });
  }
};

exports.addBranch = async (req, res) => {
  const { branch } = req.body;
  console.log("branch", branch);
  if (!branch) {
    return res.status(404).json({
      success: false,
      message: "Branch details not found",
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const branches = branch.map(
      ({ branchName, branchCode, branchStrength }) => ({
        branchName,
        branchCode,
        branchStrength,
      })
    );
    await branchSchema.insertMany(branches, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Branch details updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Error occured while adding branch details",
      error: err,
    });
  }
};

exports.addCourse = async (req, res) => {
  const { course } = req.body;

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course details not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const courses = course.map(
      ({ branchCode, courseCode, courseTitle, internal, total }) => ({
        branchCode,
        courseCode,
        courseTitle,
        internal,
        total,
      })
    );

    await courseSchema.insertMany(courses, { session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Course details updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Error occured while adding course details",
      error: err,
    });
  }
};

function randomDE() {
  return Math.floor(Math.random() * 5) + 1;
}

exports.oneTime = async (req, res) => {
  try {
    const students = await studentSchema.find({});

    const studentData = students.map((student) => {
      const de = randomDE();
      const oe = 5 - de;
      return {
        branchCode: student.branchCode,
        gpa: student.gpa,
        name: student.name,
        rollNo: student.rollNo + 400,
        semester: 8,
        de,
        oe,
      };
    });
    // await studentBackgroundInfo.deleteMany({});

    await studentBackgroundInfo.insertMany(studentData);

    return res.status(200).json({
      success: true,
      studentData,
      message: "Students Data Uploaded Successfully",
    });
  } catch (err) {
    console.log(err);
    return restatus(500).json({
      success: false,
      message: "Error occured while uploading student data",
    });
  }
};
