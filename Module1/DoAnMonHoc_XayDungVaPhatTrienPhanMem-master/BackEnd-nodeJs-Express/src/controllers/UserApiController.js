const { createUserService, userLoginService, getListUserService, getInforUserService, deleteSoftUserService, updateUserService, passwordChanceService, getEnrollService, restoreUserService, destroyUserService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const data = await createUserService(name, email, password, role);
    res.status(201).json(data);
}

const updateUser = async (req, res) => {
    const data = await updateUserService(req);
    res.status(201).json(data);
}

const restoreUser = async (req, res) => {
    const { _id } = req.body;
    const data = await restoreUserService(_id);
    res.status(201).json(data);
}


const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await userLoginService(email, password);
    res.status(200).json(data);
}

const getListUser = async (req, res) => {
    const data = await getListUserService();
    res.status(200).json(data);
}

const getAccount = async (req, res) => {
    res.status(200).json(req.user);
}

const getInforUser = async (req, res) => {
    const { _id } = req.query;
    const data = await getInforUserService(_id);
    res.status(200).json(data);
}

const getEnroll = async (req, res) => {
    const { _id } = req.query;
    const data = await getEnrollService(_id);
    res.status(200).json(data);
}

const deleteSoftUser = async (req, res) => {
    const { _id } = req.body;
    const data = await deleteSoftUserService(_id);
    res.status(200).json(data);
}

const destroyUser = async (req, res) => {
    const { _id } = req.body;
    const data = await destroyUserService(_id);
    res.status(200).json(data);
}


const passwordChance = async (req, res) => {
    const { email, pass_old, pass_new } = req.body;
    const data = await passwordChanceService(email, pass_old, pass_new);
    res.status(200).json(data);
}

module.exports = {
    createUser,
    userLogin,
    getListUser,
    getAccount,
    getInforUser,
    deleteSoftUser,
    updateUser,
    passwordChance,
    getEnroll,
    restoreUser,
    destroyUser
}
