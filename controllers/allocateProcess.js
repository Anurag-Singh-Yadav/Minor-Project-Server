const courseSchema = require("../models/courseSchema");
const studentSchema = require("../models/studentSchema");
const mongoose = require("mongoose");

exports.login = async (req , res) => {
  try{
    
  }catch(err){

  }
}


exports.allotDE = async (req, res) => {
  try {
    const courses = await courseSchema.find({});
    const students = await studentSchema.find({});

    students.sort((a , b) => b.gpa - a.gpa);

    function isAvailable(courseCode , rollNo) {
      for (let i = 0; i < courses.length; i++) {
        if (courseCode === courses[i].courseCode) {
            if(courses[i].deAllotted.length >= courses[i].internal){
                return false;
            }
            else{
                courses[i].deAllotted.push(rollNo);
                return true;
            }
        }
      }
    }

    students.map((student) => {
      const { dePreference , rollNo } = student;

      dePreference.map((courseCode) => {
        if (student.deAllotted.length < student.de && isAvailable(courseCode , rollNo)) {
            student.deAllotted.push(courseCode);
        }
      });
    });

    // Prepare the updates for bulkWrite
    const studentUpdates = students.map(student => ({
      updateOne: {
        filter: { _id: student._id },
        update: { deAllotted: student.deAllotted }
      }
    }));

    const courseUpdates = courses.map(course => ({
      updateOne: {
        filter: { _id: course._id },
        update: { deAllotted: course.deAllotted }
      }
    }));

    // Perform the updates
    await studentSchema.bulkWrite(studentUpdates);
    await courseSchema.bulkWrite(courseUpdates);

    return res.status(200).json({
      success: true,
      students: students,
      courses,
      message: 'Allottment successful',
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message || "An error occurred while allotting DE",
    }); 
  }
};

exports.allotOE = async (req, res) => {
  try {
    const courses = await courseSchema.find({});
    const students = await studentSchema.find({});

    students.sort((a , b) => b.gpa - a.gpa);

    function isAvailable(courseCode , rollNo) {
      for (let i = 0; i < courses.length; i++) {
        if (courseCode === courses[i].courseCode) {
            if(courses[i].oeAllotted.length >= courses[i].total - courses[i].deAllotted.length){
                return false;
            }
            else{
                courses[i].oeAllotted.push(rollNo);
                return true;
            }
        }
      }
    }

    students.map((student) => {
      const { oePreference , rollNo } = student;

      oePreference.map((courseCode) => {
        if (student.oeAllotted.length < student.oe && isAvailable(courseCode , rollNo)) {
            student.oeAllotted.push(courseCode);
        }
      });
    });

    // Prepare the updates for bulkWrite
    const studentUpdates = students.map(student => ({
      updateOne: {
        filter: { _id: student._id },
        update: { oeAllotted: student.oeAllotted }
      }
    }));

    const courseUpdates = courses.map(course => ({
      updateOne: {
        filter: { _id: course._id },
        update: { oeAllotted: course.oeAllotted }
      }
    }));

    // Perform the updates
    await studentSchema.bulkWrite(studentUpdates);
    await courseSchema.bulkWrite(courseUpdates);

    return res.status(200).json({
      success: true,
      students: students,
      courses,
      message: 'Allottment successful',
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message || "An error occurred while allotting OE",
    }); 
  }
};

exports.allocateDepartmentElectives = async (req, res, next) => {
  try { 
    const allStudents = await studentSchema.find({});

    allStudents.sort((a, b) => b.gpa - a.gpa);

    for (let i = 0; i < allStudents.length; i++) {
      const { branchCode, rollNo, dePreference, isFree, de } = allStudents[i];

      console.log(
        `Alloting Department elective to ${i}/${allStudents.length} rollNo ---> `,
        rollNo
      );

      if (!isFree || de === 0) {
        continue;
      }

      for (let j = 0; j < dePreference.length; j++) {
        const courseDetails = await courseSchema.findOne({
          courseCode: dePreference[j],
          branchCode: branchCode,
        });

        if (!courseDetails) {
          throw new Error(
            "Course not found!! Please match preference array with course details"
          );
        }

        if (courseDetails.branchCode !== branchCode) {
          throw new Error(
            "DE preference array of student with roll number: " +
              toString(rollNo) +
              " is not a branch from their department."
          );
        }

        if (courseDetails.deAllotted.length < courseDetails.internal) {
          courseDetails.deAllotted.push(rollNo);
          await courseDetails.save();
          allStudents[i].deAllotted.push(dePreference[j]);
          await allStudents[i].save();
          if (allStudents[i].deAllotted.length >= allStudents[i].de) break;
        }
      }
    }
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while allocating department electives",
      error: e,
    });
  }
};

exports.allocateOpenElectives = async (req, res) => {
  try {
    const allStudents = await studentSchema.find({});

    allStudents.sort((a, b) => b.gpa - a.gpa);

    for (let i = 0; i < allStudents.length; i++) {
      const { branchCode, rollNo, oePreference, isFree, oeAllotted, oe } =
        allStudents[i];

      console.log(
        `Alloting Open elective to ${i}/${allStudents.length} rollNo ---> `,
        rollNo
      );

      if (!isFree || oe == 0) {
        continue;
      }

      for (let j = 0; j < oePreference.length; j++) {
        const courseDetails = await courseSchema.findOne({
          courseCode: oePreference[j],
        });

        if (!courseDetails) {
          console.log("Error causing ---> ", oePreference[j]);
          return res.status(500).json({
            success: false,
            message: "Course not found",
          });
        }

        if (
          courseDetails.oeAllotted.length <
          courseDetails.total - courseDetails.deAllotted.length
        ) {
          courseDetails.oeAllotted.push(rollNo);
          await courseDetails.save();
          allStudents[i].oeAllotted.push(oePreference[j]);
          await allStudents[i].save();
          if (allStudents[i].oeAllotted.length === allStudents[i].oe) {
            break;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Open electives allotted successfully.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while allocating open electives",
      error: e,
    });
  }
};

exports.clearDEAllottment = async (req, res) => {
  try {
    const allCourses = await courseSchema.find({});

    for (let i = 0; i < allCourses.length; i++) {
      allCourses[i].deAllotted = [];
      await allCourses[i].save();
    }

    const allStudents = await studentSchema.find({});

    for (let i = 0; i < allStudents.length; i++) {
      allStudents[i].deAllotted = [];
      await allStudents[i].save();
    }

    return res.status(200).json({
      success: true,
      message: "All DE allotments cleared successfully.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while clearing DE allotments",
      error: e,
    });
  }
};

exports.clearOEAllottment = async (req, res) => {
  try {
    const allCourses = await courseSchema.find({});

    for (let i = 0; i < allCourses.length; i++) {
      allCourses[i].oeAllotted = [];
      await allCourses[i].save();
    }

    const allStudents = await studentSchema.find({});

    for (let i = 0; i < allStudents.length; i++) {
      allStudents[i].oeAllotted = [];
      await allStudents[i].save();
    }

    return res.status(200).json({
      success: true,
      message: "All OE allotments cleared successfully.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while clearing OE allotments",
      error: e,
    });
  }
};

exports.clearAllotments = async (req, res) => {
  try {
    await courseSchema.updateMany(
      {},
      {
        $set: {
          oeAllotted: [],
          deAllotted: [],
        },
      }
    );

    await studentSchema.updateMany(
      {},
      {
        $set: {
          oeAllotted: [],
          deAllotted: [],
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All allotments cleared successfully.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while clearing allotments",
      error: e,
    });
  }
};


