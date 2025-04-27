const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    amount: { type: Number },
    status: { type: String, enum: ['Đang chờ xử lý', 'Hoàn thành', 'Thất bại'], default: 'Đang chờ xử lý' },
    bankTranNo: { type: String },
    cardType: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
}, { timestamps: true });
const Order = mongoose.model('order', orderSchema);

module.exports = Order;
