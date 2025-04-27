const { createLessonService, deleteLessonService, getLessonListService, destroyLessonService, restoreLessonService, updateLessonService } = require("../services/lessonService");

const createLesson = async (req, res) => {
    const { title, content, video_id, course_id, order } = req.body;
    const data = await createLessonService(title, content, video_id, course_id, order);
    res.status(201).json(data);
}

const updateLesson = async (req, res) => {
    const { _id: lessonId, lesson } = req.body;
    const data = await updateLessonService(lessonId, lesson);
    res.status(200).json(data);
}


const deleteLesson = async (req, res) => {
    const { lessonId } = req.query;
    const data = await deleteLessonService(lessonId);
    res.status(201).json(data);
}

const restoreLesson = async (req, res) => {
    const { lessonId } = req.body;
    const data = await restoreLessonService(lessonId);
    res.status(201).json(data);
}


const destroyLesson = async (req, res) => {
    const { lessonId } = req.query;
    const data = await destroyLessonService(lessonId);
    res.status(201).json(data);
}


const getLessonList = async (req, res) => {
    const { course_id } = req.query;
    const data = await getLessonListService(course_id);

    res.status(200).json(data);
}

module.exports = {
    createLesson,
    deleteLesson,
    getLessonList,
    destroyLesson,
    restoreLesson,
    updateLesson
}
