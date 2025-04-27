const { getAcctivieService, createAcctivieService } = require("../services/activitieService")

const getAcctivie = async (req, res) => {
    const data = await getAcctivieService();
    return res.json(data);
}

const createAcctivie = async (req, res) => {
    const data = await createAcctivieService(req.body);
    return res.json(data);
}

module.exports = {
    getAcctivie,
    createAcctivie
}
