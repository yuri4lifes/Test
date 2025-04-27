const express = require('express');
const route = express.Router();

const activitieController = require('../controllers/activitieApiController');

route.get('/get-activitie', activitieController.getAcctivie);
route.post('/create-activitie', activitieController.createAcctivie);

module.exports = route;
