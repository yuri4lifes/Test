const express = require('express');
const route = express.Router();
const upload = require("../midleware/multer");
const uploadController = require('../controllers/UpLoadController');

route.post('/upload', upload.single("file"), uploadController.UpLoadImg);

module.exports = route;
