const courseSchema = require("../models/courseSchema");
const studentSchema = require("../models/studentSchema")

exports.allocateDepartmentElectives = async (req , res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{

        const allStudents = await studentSchema.find({});

        allStudents.sort((a , b) => b.gpa - a.gpa);

        for(let i = 0 ; i < allStudents.length ; i++){
            const {branchCode , rollNo , dePreference , isFree , de} = allStudents[i];

            if(!isFree || de == 0){
                continue;
            }

            for(let j = 0 ; j < dePreference.length ; j++){
                const courseDetails = await courseSchema.findOne({
                    courseCode : dePreference[j],
                    branchCode : branchCode,
                });

                if(!courseDetails){
                    throw new Error('Course not found!! Please match preference array with course details');
                }

                if(courseDetails.branchCode !== branchCode){
                    throw new Error('DE preference array of student with roll number: ' + toString(rollNo) + ' is not a branch from their department.');
                }

                if(courseDetails.deAllotted.length < courseDetails.internal){
                    courseDetails.deAllotted.push(rollNo);
                    await courseDetails.save({session});
                    allStudents[i].de--;
                    allStudents[i].deAllotted.push(courseCode);
                    await allStudents[i].save({session});
                    if(allStudents[i].de == 0)break;
                }
            }
        }

        await session.commitTransaction();
        session.endSession();

    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(e);
        res.status(500).json({
            success:false,
            message:'An error occurred while allocating department electives',
            error: e,
        });
    }
}

exports.allocateOpenElectives = async (req , res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{

        const allStudents = await studentSchema.find({});

        allStudents.sort((a , b) => b.gpa - a.gpa);

        for(let i = 0 ; i < allStudents.length ; i++){
            const {branchCode , rollNo , oePreference , isFree , oeAllotted , oe} = allStudents[i];

            if(!isFree || oeAllotted.length >= oe){
                continue;
            }

            for(let j = 0 ; j < oePreference.length ; j++){
                const courseDetails = await courseSchema.findOne({
                    courseCode : oePreference[j],
                    branchCode : branchCode,
                });

                if(!courseDetails){
                    throw new Error('Course not found!! Please match preference array with course details');
                }

                if(courseDetails.oeAllotted.length < courseDetails.total - courseDetails.internal){
                    courseDetails.oeAllotted.push(rollNo);
                    await courseDetails.save({session});
                    allStudents[i].oeAllotted.push(courseDetails.courseCode);
                    await allStudents[i].save({session});
                    if(allStudents[i].oeAllotted.length === allStudents[i].oe){
                        break;
                    }
                }
            }
        }

        await session.commitTransaction();
        session.endSession();


        return res.status(200).json({
            success:true,
            message:'Open electives allotted successfully.',
        })

    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(e);
        res.status(500).json({
            success:false,
            message:'An error occurred while allocating open electives',
            error: e,
        });
    }
}

exports.clearDEAllottment = async (req , res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const allCourses = await courseSchema.find({});

        for(let i = 0 ; i < allCourses.length ; i++){
            allCourses[i].deAllotted = [];
            await allCourses[i].save({session});
        }

        const allStudents = await studentSchema.find({});

        for(let i = 0 ; i < allStudents.length ; i++){
            allStudents[i].deAllotted = [];
            await allStudents[i].save({session});
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message:'All DE allotments cleared successfully.',
        })

    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(e);
        res.status(500).json({
            success:false,
            message:'An error occurred while clearing DE allotments',
            error: e,
        });
    }
}

exports.clearOEAllottment = async (req , res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const allCourses = await courseSchema.find({});

        for(let i = 0 ; i < allCourses.length ; i++){
            allCourses[i].oeAllotted = [];
            await allCourses[i].save({session});
        }

        const allStudents = await studentSchema.find({});

        for(let i = 0 ; i < allStudents.length ; i++){
            allStudents[i].oeAllotted = [];
            await allStudents[i].save({session});
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message:'All OE allotments cleared successfully.',
        })

    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(e);
        res.status(500).json({
            success:false,
            message:'An error occurred while clearing OE allotments',
            error: e,
        });
    }
}

exports.clearAllotments = async (req , res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const allCourses = await courseSchema.find({});

        for(let i = 0 ; i < allCourses.length ; i++){
            allCourses[i].deAllotted = [];
            allCourses[i].oeAllotted = [];
            await allCourses[i].save({session});
        }

        const allStudents = await studentSchema.find({});

        for(let i = 0 ; i < allStudents.length ; i++){
            allStudents[i].deAllotted = [];
            allStudents[i].oeAllotted = [];
            await allStudents[i].save({session});
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message:'All allotments cleared successfully.',
        })

    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(e);
        res.status(500).json({
            success:false,
            message:'An error occurred while clearing allotments',
            error: e,
        });
    }
}