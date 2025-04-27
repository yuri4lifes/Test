const Course = require("../models/course");
const Lesson = require("../models/lesson");

const createLessonService = async (title, content, video_id, course_id, order) => {
    try {
        // Kiểm tra khóa học có tồn tại không
        const course = await Course.findById(course_id);
        if (!course) {
            return ({ message: "Khóa học không tồn tại" });
        }
        // Tạo bài học mới
        const newLesson = new Lesson({
            title,
            content,
            video_id,
            course_id,
            order,
            lesson_img: `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCvhOydCVOREo2vIDNsS1lXKWwQgA`
        });

        await newLesson.save();
        course.lessons.push(newLesson._id);
        await course.save();

        return ({ lesson: newLesson, EC: 0 });
    } catch (error) {
        return null;
    }
}

const updateLessonService = async (lessonId, lesson) => {
    try {
        lesson.lesson_img = `https://i.ytimg.com/vi/${lesson.video_id}/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCvhOydCVOREo2vIDNsS1lXKWwQgA`
        const result = await Lesson.updateOne({ _id: lessonId }, lesson);
        return result;
    } catch (error) {
        return null;
    }
}

const deleteLessonService = async (id) => {
    try {
        let result = await Lesson.delete({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const restoreLessonService = async (id) => {
    try {
        let result = await Lesson.restore({ _id: id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const destroyLessonService = async (lessonId) => {
    try {
        const lesson = await Lesson.findOneWithDeleted({ _id: lessonId });

        //Xoa bai hoc khoi khoa hoc
        if (lesson) {
            const course = await Course.findOneWithDeleted({ _id: lesson.course_id });
            if (course) {
                const indexLesson = course?.lessons?.indexOf(lesson._id);
                if (indexLesson !== -1) {
                    course?.lessons?.splice(indexLesson, 1);
                    await course.save();
                }
            }
        }

        const result = await Lesson.deleteOne({ _id: lessonId });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getLessonListService = async (course_id) => {
    try {
        let result = await Lesson.findWithDeleted({ course_id: course_id })
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createLessonService,
    deleteLessonService,
    getLessonListService,
    destroyLessonService,
    restoreLessonService,
    updateLessonService,
}
