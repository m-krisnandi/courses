import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    course_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course_category',
    }
})

const Course = mongoose.model('Course', courseSchema);

export { Course };