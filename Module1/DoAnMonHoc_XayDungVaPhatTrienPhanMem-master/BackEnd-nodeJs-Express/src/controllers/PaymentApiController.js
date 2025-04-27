const { createPaymentService } = require("../services/paymentService")
const Order = require("../models/order");


const paymentCreate = async (req, res) => {
    const paymentData = req.query;
    paymentData.vnp_IpAddr = getClientIp(req)

    const vnpUrl = await createPaymentService(paymentData);
    return res.status(201).json(vnpUrl);
}

function getClientIp(req) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    return req.socket.remoteAddress;
}

const checkPayment = async (req, res) => {
    try {
        const vnpayData = req.query;
        const order = await Order.findById(vnpayData.vnp_OrderInfo);

        if (!order) {
            return res.redirect(`${process.env.NODE_FRONTEND_URL}/payment-failed/${vnpayData.vnp_OrderInfo}`);
        }

        order.cardType = vnpayData.vnp_CardType;
        order.bankTranNo = vnpayData?.vnp_BankTranNo || 'VNPAY-4869';

        if (vnpayData.vnp_ResponseCode === '00') {
            order.status = "Hoàn thành";
            await order.save();
            return res.redirect(`${process.env.NODE_FRONTEND_URL}/payment-success/${vnpayData.vnp_OrderInfo}`);
        } else {
            order.status = "Thất bại";
            await order.save();
            return res.redirect(`${process.env.NODE_FRONTEND_URL}/payment-failed/${vnpayData.vnp_OrderInfo}`);
        }
    } catch (error) {
        console.error('Lỗi xử lý returnUrl:', error);
        return res.redirect(`${process.env.NODE_FRONTEND_URL}/payment-failed/${vnpayData.vnp_OrderInfo}`);
    }
};
module.exports = {
    paymentCreate,
    checkPayment
}