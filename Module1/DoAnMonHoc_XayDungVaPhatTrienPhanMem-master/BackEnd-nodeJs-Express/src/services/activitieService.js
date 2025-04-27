const Activitie = require("../models/activitie");

const getAcctivieService = async () => {
    try {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - 7);
        const result = await Activitie.find({ createdAt: { $gte: daysAgo } });
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const createAcctivieService = async (acctivitie) => {
    try {
        const result = await Activitie.create(acctivitie);
        return result;
    } catch {
        return null;
    }
}

module.exports = {
    getAcctivieService,
    createAcctivieService
};
