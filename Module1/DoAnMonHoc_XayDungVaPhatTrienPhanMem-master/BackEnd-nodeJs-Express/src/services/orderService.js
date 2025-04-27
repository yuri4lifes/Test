const Order = require("../models/order");

const orderCreateService = async (orderData) => {
    try {
        const result = await Order.create(orderData);
        return result;
    } catch (error) {
        return null;
    }
}

const getOrderDetailService = async (order_id) => {
    try {
        const result = await Order.findById({ _id: order_id });
        return result;
    } catch (error) {
        return null;
    }
}

module.exports = {
    orderCreateService,
    getOrderDetailService
};
