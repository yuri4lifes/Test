import axios from "./axios.custom";

const GetActivitie = () => {
    const URL_API = "/v1/api/get-activitie";
    return axios.get(URL_API);
}

const createActivitie = (acctivitie) => {
    const URL_API = "/v1/api/create-activitie";

    return axios.post(URL_API, acctivitie);
}

export {
    GetActivitie,
    createActivitie
}
