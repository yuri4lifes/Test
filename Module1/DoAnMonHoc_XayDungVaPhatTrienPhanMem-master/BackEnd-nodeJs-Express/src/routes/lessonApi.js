const express = require('express');

const route = express.Router();
const auth = require('../midleware/auth');

const courseController = require('../controllers/LessonApiController');
const verifyRole = require('../midleware/verifyRole');

route.all('*', auth, verifyRole);

route.post('/create-lesson', courseController.createLesson);
route.post('/update-lesson', courseController.updateLesson);
route.delete('/delete-lesson', courseController.deleteLesson);
route.patch('/restore-lesson', courseController.restoreLesson);
route.delete('/destroy-lesson', courseController.destroyLesson);
route.get('/lesson-list', courseController.getLessonList);

module.exports = route;
