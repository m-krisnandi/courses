import mongoose from "mongoose";

const userCourseSchema = new mongoose.Schema({
    users_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }
})

const userCourse = mongoose.model('User_course', userCourseSchema);

export { userCourse };