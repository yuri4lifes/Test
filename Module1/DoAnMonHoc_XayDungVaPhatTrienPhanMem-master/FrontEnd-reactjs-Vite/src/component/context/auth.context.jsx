import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthWrapper = (props) => {
    // Khởi tạo state từ localStorage nếu có
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        const savedAuth = localStorage.getItem('auth');
        if (token && savedAuth) {
            return JSON.parse(savedAuth);
        }
        return {
            isAuthenticated: false,
            user: {
                id: "",
                email: "",
                name: "",
                avatar: "",
                role: ""
            }
        };
    });

    const [loading, setLoading] = useState(false);

    // Lưu auth vào localStorage mỗi khi nó thay đổi
    useEffect(() => {
        if (auth.isAuthenticated) {
            localStorage.setItem('auth', JSON.stringify(auth));
        } else {
            localStorage.removeItem('auth');
        }
    }, [auth]);

    // Hàm cập nhật auth
    const updateAuth = (newAuth) => {
        setAuth(newAuth);
    };

    // Hàm logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        setAuth({
            isAuthenticated: false,
            user: {
                id: "",
                email: "",
                name: "",
                avatar: "",
                role: ""
            }
        });
    };

    return (
        <AuthContext.Provider value={{
            auth,
            setAuth: updateAuth,
            loading,
            setLoading,
            logout
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export {
    AuthContext,
    AuthWrapper
}