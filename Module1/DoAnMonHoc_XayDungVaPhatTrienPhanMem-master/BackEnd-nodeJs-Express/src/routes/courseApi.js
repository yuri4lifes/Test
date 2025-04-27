const express = require('express');

const route = express.Router();
const auth = require('../midleware/auth');

const courseController = require('../controllers/CourseApiController');
const verifyRole = require('../midleware/verifyRole');

route.all('*', auth, verifyRole);

route.post('/course-create', courseController.createCoure);
route.put('/course-update/:id', courseController.updateCoure);
route.get('/courselist', courseController.getCourseList);
route.get('/courselist/:teacher_id', courseController.getCourseListByTeacherId);
route.get('/courselist-delete', courseController.getCourseListDelete);
route.get('/getcourse/:course_id', courseController.getCourse);
route.delete('/delete-course/:course_id', courseController.deleteCourse);
route.delete('/delete-course-destroy/:course_id', courseController.destroyCourse);
route.patch('/restore-course/:course_id', courseController.restoreCourse);
route.get('/get-accactivities', courseController.getActivities);

module.exports = route;
