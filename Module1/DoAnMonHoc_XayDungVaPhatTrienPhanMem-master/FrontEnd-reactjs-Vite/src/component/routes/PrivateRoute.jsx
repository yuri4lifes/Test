import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, role }) => {
    const { auth } = useContext(AuthContext)

    if (!auth?.user) {
        return <Navigate to="/login" />;
    }

    if (Array.isArray(role)) {
        // Nếu role là mảng, kiểm tra xem user.role có trong danh sách không
        if (!role.includes(auth.user.role)) {
            return <Navigate to="/" />;
        }
    } else {
        // Nếu chỉ có một role, kiểm tra như bình thường
        if (auth.user.role !== role) {
            return <Navigate to="/" />;
        }
    }

    return element;
};

export default PrivateRoute;
