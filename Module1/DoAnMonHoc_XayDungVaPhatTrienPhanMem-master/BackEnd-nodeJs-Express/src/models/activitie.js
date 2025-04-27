const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const activitieSchema = new mongoose.Schema({
    type: { type: String, enum: ['register_account', 'register_course', 'add_course'], default: 'register_account' },
    userName: { type: String, default: 'User' },
    courseName: { type: String },
}, { timestamps: true });

activitieSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: 'all' });
const Activitie = mongoose.model('activitie', activitieSchema);

module.exports = Activitie;
