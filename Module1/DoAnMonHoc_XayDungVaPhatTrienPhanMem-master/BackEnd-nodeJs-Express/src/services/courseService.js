const moment = require("moment");
const Course = require("../models/course");
const Lesson = require("../models/lesson");
const User = require("../models/user");
const Activitie = require("../models/activitie");

const createCourseService = async (name, description, price, course_img, teacher_id) => {
    try {
        const teacher = await User.findOne({ _id: teacher_id });
        if (!teacher) {
            return ({ message: "Giảng viên không hợp lệ!" });
        }

        const result = await Course.create({
            name: name,
            description: description,
            price: price,
            course_img: course_img,
            teacher_id: teacher_id
        })

        if (result) {
            const teacher = await User.findOne({ _id: result?.teacher_id }).select("name");
            await Activitie.create({
                type: "add_course",
                userName: teacher?.name || "Teacher-name",
                courseName: result?.name || "Course-name"
            })
        }

        teacher.createdCourses.push(result._id);
        await teacher.save();

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateCourseService = async (course_id, data) => {
    try {
        const result = await Course.updateOne({ _id: course_id }, data)
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const deleteCourseService = async (id) => {
    try {
        const result = await Course.delete({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const destroyCourseService = async (id) => {
    try {
        //Xoa cac bai hoc lien quan
        await Lesson.deleteMany({ course_id: id });

        //Xoa bai hoc user da dang ky

        const result = await Course.deleteOne({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseService = async (id) => {
    try {
        const result = await Course.findById({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const restoreCourseService = async (id) => {
    try {
        const result = await Course.restore({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseListService = async () => {
    try {
        const result = await Course.find({})
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseListByTeacherIdService = async (teacher_id) => {
    try {
        const result = await Course.findWithDeleted({ teacher_id: teacher_id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCourseListDeleteService = async () => {
    try {
        const result = await Course.findDeleted({ deletedAt: { $ne: null } }).populate('teacher_id', 'name');
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getActivitiesService = async () => {
    try {
        const courses = await Course.find()
            .populate('students', 'name email')  // Liên kết với bảng users để lấy thông tin học viên
            .populate('teacher_id', 'name email').select("name createdAt updatedAt");

        // Lấy thông tin về các hoạt động gần đây
        const activities = courses.map(course => {
            // Các hoạt động học viên đăng ký
            return course.students.map(student => ({
                message: `${student.name} đã đăng ký khóa học "${course.name}".`,
                color: 'green',
                date: moment(course.createdAt).format('DD/MM/YYYY')
            }));
        }).flat();

        return activities;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createCourseService,
    updateCourseService,
    deleteCourseService,
    destroyCourseService,
    getCourseService,
    getCourseListService,
    getCourseListDeleteService,
    restoreCourseService,
    getCourseListByTeacherIdService,
    getActivitiesService,
}
