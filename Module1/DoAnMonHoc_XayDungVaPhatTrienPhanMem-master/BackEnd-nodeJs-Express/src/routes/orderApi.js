const express = require('express');
const route = express.Router();

const orderController = require('../controllers/OrderApiController');

route.get('/order-create', orderController.orderCreate);
route.get('/order-detail', orderController.getOrderDetail);

module.exports = route;
