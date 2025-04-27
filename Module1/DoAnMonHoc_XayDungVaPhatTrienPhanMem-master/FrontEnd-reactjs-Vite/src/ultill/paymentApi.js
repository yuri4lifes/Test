import axios from "./axios.custom";

const GetQrUrl = async (paymentData) => {
    const URL_API = "/v1/api/get-payment";
    return axios.get(URL_API, {
        params: paymentData
    });
};
export {
    GetQrUrl
}
