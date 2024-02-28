const studentSchema = require("../models/studentSchema");

exports.overWriteStudentDetails = async (req, res) => {
  const { studentDetails } = req.data;

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
        branch,
        gpa,
        name,
        de,
        ge,
        isFree,
        rollNo,
        oePreference,
        dePreference,
      }) => ({
        branch,
        gpa,
        name,
        de,
        ge,
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

exports.addStudents = async (req, res) => {
  const { students } = req.body;

  if (!students) {
    return res.status(404).json({
      success: false,
      message: "Student details not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const students = students.map(
      ({
        branch,
        gpa,
        name,
        de,
        ge,
        isFree,
        rollNo,
        oePreference,
        dePreference,
      }) => ({
        branch,
        gpa,
        name,
        de,
        ge,
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
      message: "Error occured while adding student details",
      error: err,
    });
  }
};

exports.addBranch = async (req, res) => {
  const { branch } = req.body;

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
      ({
        branchCode,
        courseCode,
        courseTitle,
        internal,
        total,
      }) => ({
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
