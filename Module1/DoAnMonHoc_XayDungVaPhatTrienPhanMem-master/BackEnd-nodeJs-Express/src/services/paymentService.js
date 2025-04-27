const { ProductCode, VNPay, VnpLocale, dateFormat, ignoreLogger } = require('vnpay');

const createPaymentService = async (paymentData) => {
    try {
        const vnpay = new VNPay({
            tmnCode: '9XCTQPJ2',
            secureSecret: 'QEAXMX5KZW45HV6IS7D08ZLBDW3MFYGR',
            vnpayHost: 'https://sandbox.vnpayment.vn',

            testMode: true,
            hashAlgorithm: 'SHA512',
            enableLog: true,
            loggerFn: ignoreLogger,

            endpoints: {
                paymentEndpoint: 'paymentv2/vpcpay.html',
                queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
                getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
            }
        });

        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);

        const vnp_Amount = Number(paymentData.vnp_Amount);

        const vnpayUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: vnp_Amount,
            vnp_IpAddr: paymentData.vnp_IpAddr || '127.0.0.1',
            vnp_TxnRef: Date.now().toString(),
            vnp_OrderInfo: paymentData.orderInfo || 'Thanh toán VNPAY',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: paymentData.vnp_ReturnUrl || 'http://localhost:8080/v1/api/vnpay-return',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(now),
            vnp_ExpireDate: dateFormat(tomorrow),
        });

        return { EC: 0, vnpUrl: vnpayUrl };
    } catch (error) {
        return { EC: 1, message: 'Lỗi tạo URL thanh toán' };
    }
};

module.exports = {
    createPaymentService,
};
