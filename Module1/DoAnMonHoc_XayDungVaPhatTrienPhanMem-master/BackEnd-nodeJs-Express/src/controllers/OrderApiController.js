const { orderCreateService, getOrderDetailService } = require("../services/orderService")

const orderCreate = async (req, res) => {
    const data = await orderCreateService(req.query);
    return res.status(201).json(data);
}

const getOrderDetail = async (req, res) => {
    const { order_id } = req.query
    const data = await getOrderDetailService(order_id);
    return res.status(201).json(data);
}

module.exports = {
    orderCreate,
    getOrderDetail
}