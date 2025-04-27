import axios from "./axios.custom";

const GetCourseList = () => {
    const URL_API = "/v1/api/courselist";
    return axios.get(URL_API);
}

const GetCourseListByTeacherId = (teacher_id) => {
    const URL_API = `/v1/api/courselist/${teacher_id}`;
    return axios.get(URL_API);
}

const GetCourseListDelete = () => {
    const URL_API = "/v1/api/courselist-delete";
    return axios.get(URL_API);
}


const GetCourse = (course_id) => {
    const URL_API = `/v1/api/getcourse/${course_id}`;
    return axios.get(URL_API);
}

const CourseCreate = (name, description, course_img, price, teacher_id) => {
    const URL_API = "/v1/api/course-create";
    const data = { name, description, course_img, price, teacher_id }
    return axios.post(URL_API, data);
}

const CourseUpdate = (course_id, data) => {
    const URL_API = `/v1/api/course-update/${course_id}`;
    return axios.put(URL_API, data);
}

const DeleteSoftCourse = (course_id) => {
    const URL_API = `/v1/api/delete-course/${course_id}`;
    return axios.delete(URL_API);
}

const DestroyCourse = (course_id) => {
    const URL_API = `/v1/api/delete-course-destroy/${course_id}`;
    return axios.delete(URL_API);
}

const restoreCourse = (course_id) => {
    const URL_API = `/v1/api/restore-course/${course_id}`;
    return axios.patch(URL_API);
}

export {
    GetCourseList,
    GetCourseListDelete,
    CourseCreate,
    GetCourse,
    DeleteSoftCourse,
    restoreCourse,
    DestroyCourse,
    GetCourseListByTeacherId,
    CourseUpdate,
}
