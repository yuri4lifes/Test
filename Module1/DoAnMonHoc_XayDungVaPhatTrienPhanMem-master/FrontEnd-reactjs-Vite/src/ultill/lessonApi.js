import axios from "./axios.custom";

const LessonCreate = (lessonData) => {
    const URL_API = "/v1/api/create-lesson";
    const data = lessonData;
    return axios.post(URL_API, data);
}

const LessonUpdate = (_id, lesson) => {
    const URL_API = "/v1/api/update-lesson";
    const data = { _id, lesson };
    return axios.post(URL_API, data);
}

const GetLessonList = (course_id) => {
    const URL_API = `/v1/api/lesson-list`;
    return axios.get(URL_API, { params: { course_id } });
}

const LessonDelete = (lessonId) => {
    const URL_API = "/v1/api/delete-lesson";

    return axios.delete(URL_API, { params: { lessonId } });
}

const LessonDestroy = (lessonId) => {
    const URL_API = "/v1/api/destroy-lesson";

    return axios.delete(URL_API, { params: { lessonId } });
}

const LessonRestore = (lessonId) => {
    const URL_API = "/v1/api/restore-lesson";
    return axios.patch(URL_API, { lessonId });
}


export {
    GetLessonList,
    LessonCreate,
    LessonDelete,
    LessonDestroy,
    LessonRestore,
    LessonUpdate
}
