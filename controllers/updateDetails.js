


exports.overWriteStudentDetails = async (req , res) => {
    const {studentDetails} = req.data;

    if(!studentDetails){
        return res.status(404).json({
            success: false,
            message: "Student details not found",
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{

        

    } catch(err){

    }
}