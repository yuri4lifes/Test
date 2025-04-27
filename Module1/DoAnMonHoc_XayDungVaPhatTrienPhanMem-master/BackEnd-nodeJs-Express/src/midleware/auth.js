const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const whiteList = ["/", "/login", "/register", "/courselist", "/profile-update", "/password-chance", "/lesson-list", "/getcourse"];

    if (whiteList.some(route => req.path.startsWith(route))) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ EC: "Token không tồn tại hoặc không đúng định dạng!" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decode.id,
            name: decode.name,
            email: decode.email,
            avatar: decode.avatar,
            role: decode.role
        };
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ EC: "Token đã hết hạn!" });
        } else {
            return res.status(401).json({ EC: "Token không hợp lệ!" });
        }
    }
}

module.exports = auth;
