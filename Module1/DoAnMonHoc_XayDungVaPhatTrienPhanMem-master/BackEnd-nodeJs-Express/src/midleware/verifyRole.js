const verifyRole = (req, res, next) => {
    const whiteList = ["/", "/login", "/register", "/getaccount", "/courselist", "/profile-update", "/password-chance", "/course-lesson-list", "/getcourse"];

    if (whiteList.some(route => req.path.startsWith(route))) {
        return next();
    }

    const user = req.user;

    // Kiểm tra người dùng đã đăng nhập hay chưa
    if (!user) {
        return res.status(401).json({ EC: 401, message: "Vui lòng đăng nhập để truy cập tài nguyên này!" });
    }

    // Kiểm tra quyền truy cập
    if (user?.role !== "admin" && user?.role !== "teacher") {
        return res.status(403).json({ EC: 403, message: "Tài khoản không được phép truy cập tài nguyên này!" });
    }

    next();
};

module.exports = verifyRole;
