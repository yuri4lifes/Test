import axios from "./axios.custom";

const OrderCreate = async (orderData) => {
    const URL_API = "/v1/api/order-create";
    return axios.get(URL_API, {
        params: orderData
    });
};

const GetOrderDetail = async (order_id) => {
    const URL_API = "/v1/api/order-detail";
    return axios.get(URL_API, {
        params: { order_id }
    });
};

export {
    OrderCreate,
    GetOrderDetail
}
