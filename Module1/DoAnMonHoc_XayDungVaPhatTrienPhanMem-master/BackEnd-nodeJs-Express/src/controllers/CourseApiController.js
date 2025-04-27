const { createCourseService, getCourseListService, getCourseService, deleteCourseService, getCourseListDeleteService, destroyCourseService, restoreCourseService, getCourseListByTeacherIdService, updateCourseService, getActivitiesService } = require("../services/courseService");

const createCoure = async (req, res) => {
    const { name, description, price, course_img, teacher_id } = req.body;
    const data = await createCourseService(name, description, price, course_img, teacher_id);
    res.status(201).json(data);
}

const updateCoure = async (req, res) => {
    const data = await updateCourseService(req.params.id, req.body);
    res.status(201).json(data);
}

const getCourseList = async (req, res) => {
    const data = await getCourseListService();
    res.status(200).json(data);
}

const getCourseListByTeacherId = async (req, res) => {
    const data = await getCourseListByTeacherIdService(req.params.teacher_id);
    res.status(200).json(data);
}

const getCourseListDelete = async (req, res) => {
    const data = await getCourseListDeleteService();
    res.status(200).json(data);
}

const getCourse = async (req, res) => {
    const id = req.params.course_id;
    const data = await getCourseService(id);
    res.status(200).json(data);
}

const deleteCourse = async (req, res) => {
    const id = req.params.course_id;
    const data = await deleteCourseService(id);
    res.json(data);
}

const destroyCourse = async (req, res) => {
    const id = req.params.course_id;
    const data = await destroyCourseService(id);
    res.json(data);
}

const restoreCourse = async (req, res) => {
    const id = req.params.course_id;
    const data = await restoreCourseService(id);
    res.status(200).json(data);
}

const getActivities = async (req, res) => {
    const data = await getActivitiesService();
    res.status(200).json(data);
}


module.exports = {
    createCoure,
    getCourse,
    getCourseList,
    deleteCourse,
    getCourseListDelete,
    destroyCourse,
    restoreCourse,
    getCourseListByTeacherId,
    updateCoure,
    getActivities
}
