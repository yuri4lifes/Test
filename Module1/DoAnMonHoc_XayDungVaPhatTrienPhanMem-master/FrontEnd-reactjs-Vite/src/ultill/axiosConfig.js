import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000,
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            // Token hết hạn hoặc không hợp lệ
            if (error.response.status === 401) {
                // Lưu URL hiện tại vào localStorage
                const currentPath = window.location.pathname + window.location.search;
                if (currentPath !== '/login') {
                    localStorage.setItem('redirectUrl', currentPath);
                }

                // Xóa token và thông tin user khỏi localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Chuyển hướng về trang login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance; 