import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../../contexts/auth.context';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const result = await login(values);
            if (result.success) {
                message.success('Đăng nhập thành công!');

                // Kiểm tra và chuyển hướng về trang trước đó
                const redirectUrl = localStorage.getItem('redirectUrl');
                if (redirectUrl) {
                    localStorage.removeItem('redirectUrl');
                    navigate(redirectUrl);
                } else {
                    navigate('/'); // Hoặc trang mặc định khác
                }
            } else {
                message.error(result.message || 'Đăng nhập thất bại!');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Đăng nhập thất bại!');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Đăng nhập</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                            {
                                type: 'email',
                                message: 'Email không hợp lệ!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login; 