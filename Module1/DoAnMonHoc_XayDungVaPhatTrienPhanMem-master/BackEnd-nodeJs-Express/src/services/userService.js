const User = require("../models/user");
const Activitie = require("../models/activitie");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Course = require("../models/course");
const saltRounds = 10;

//Dang ky tai khoan
const createUserService = async (name, email, password, role) => {
    try {
        //Kiem tra tai khoan da ton tai chua
        const user = await User.findOne({ email });
        if (user) {
            return "User da ton tai";
        }
        //Hash password
        const hashPass = await bcrypt.hash(password, saltRounds);
        let result = await User.create({
            name: name,
            email: email,
            password: hashPass,
            role: role ? role : "user"
        })

        if (result) {
            await Activitie.create({
                type: "register_account",
                userName: result?.name || "User-name",
            })
        }

        return { result, EC: 0 };
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Nguoi dung dang nhap
const userLoginService = async (email, password) => {
    try {
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatchPass = await bcrypt.compare(password, userLogin.password);

            if (!isMatchPass) {
                return {
                    Error: 'Email hoặc mật khẩu không hợp lệ!'
                }
            }
            else {
                const payload = {
                    id: userLogin._id,
                    name: userLogin.name,
                    email: userLogin.email,
                    avatar: userLogin.avatar,
                    role: userLogin.role
                }
                //Tao token
                const accessToken = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES
                    }
                );
                return { accessToken, userLogin, EC: 0 }
            }
        }
        else {
            return {
                Error: 'Email hoặc mật khẩu không hợp lệ!'
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Danh sach nguoi dung
const getListUserService = async () => {
    try {
        const userList = await User.findWithDeleted({}, { password: 0 });
        return userList;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getInforUserService = async (_id) => {
    try {
        const infor = await User.findOne({ _id: _id }, { password: 0 });
        return infor;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getEnrollService = async (_id) => {
    try {
        const student = await User.findOne({ _id: _id });
        if (!student) {
            return null;
        }

        if (!Array.isArray(student.enrolledCourses)) {
            return null;
        }

        const courses = await Course.find({ _id: { $in: student.enrolledCourses } })
            .select('_id name price course_img teacher_id');
        return courses;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateUserService = async (req) => {
    try {
        const result = await User.updateOne({ _id: req.body._id }, req.body);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const restoreUserService = async (_id) => {
    try {
        const result = await User.restore({ _id: _id });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const deleteSoftUserService = async (_id) => {
    try {
        const result = await User.delete({ _id: _id });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const destroyUserService = async (_id) => {
    try {
        const result = await User.deleteOne({ _id: _id });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function passwordChanceService(email, pass_old, pass_new) {
    try {
        const userLogin = await User.findOne({ email: email });
        if (!userLogin) {
            return { Error: 'Tài khoản không tồn tại!' };
        }

        const isMatchPass = await bcrypt.compare(pass_old, userLogin.password);

        if (!isMatchPass) {
            return { Error: 'Email hoặc mật khẩu không hợp lệ!' };
        }

        const saltRounds = 10;
        const hashPass = await bcrypt.hash(pass_new, saltRounds);

        const result = await User.updateOne({ email: email }, { $set: { password: hashPass } });

        return result.modifiedCount > 0 ? { Success: 'Mật khẩu đã được thay đổi!' } : { Error: 'Không thể cập nhật mật khẩu!' };
    } catch (error) {
        console.log(error);
        return { Error: 'Đã xảy ra lỗi hệ thống!' };
    }
}

module.exports = {
    createUserService,
    userLoginService,
    getListUserService,
    getInforUserService,
    deleteSoftUserService,
    updateUserService,
    passwordChanceService,
    getEnrollService,
    restoreUserService,
    destroyUserService
}
