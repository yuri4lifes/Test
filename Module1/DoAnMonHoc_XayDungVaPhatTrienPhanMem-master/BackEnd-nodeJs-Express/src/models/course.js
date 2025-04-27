const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    course_img: { type: String, default: '' },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Liên kết với User
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'lesson' }], // Liên kết với Lesson
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // Học viên đăng ký
}, { timestamps: true });

courseSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: 'all' });
const Course = mongoose.model('course', courseSchema);

module.exports = Course;
