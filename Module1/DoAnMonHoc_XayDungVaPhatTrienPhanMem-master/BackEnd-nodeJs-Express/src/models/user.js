const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Tên người dùng
    email: { type: String, required: true, unique: true, trim: true }, // Email duy nhất
    password: { type: String, required: true }, // Mật khẩu (nên mã hóa trước khi lưu)
    role: { type: String, enum: ['user', 'teacher', 'admin'], default: 'user' }, // Phân quyền
    avatar: { type: String, default: '' }, // Ảnh đại diện
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Khóa học đã đăng ký (dành cho học viên)
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Khóa học đã tạo (dành cho giảng viên)
}, { timestamps: true });

userSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: 'all' });
const User = mongoose.model('user', userSchema);


module.exports = User;
