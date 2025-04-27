const express = require('express');
const route = express.Router();

const paymentController = require('../controllers/PaymentApiController');

route.get('/get-payment', paymentController.paymentCreate);
route.get('/vnpay-return', paymentController.checkPayment);

module.exports = route;
