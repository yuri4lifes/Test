import React, { useContext, useState } from 'react';
import { Form, Input, Button, Typography, message, Divider, Row, Col } from 'antd';
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    MailOutlined,
    UserOutlined
} from '@ant-design/icons';
import { UserLogin } from '../../ultill/userApi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const { Title, Text, Paragraph } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuth, auth } = useContext(AuthContext);
    const location = useLocation();
    const redirectTo = location.state?.from || '/';

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const { email, password } = values;
            const res = await UserLogin(email, password);
            if (res && res.EC === 0) {
                localStorage.setItem('token', res.accessToken);

                const authData = {
                    isAuthenticated: true,
                    user: {
                        id: res?.userLogin?._id ?? "",
                        email: res?.userLogin?.email ?? "",
                        name: res?.userLogin?.name ?? "",
                        avatar: res?.userLogin?.avatar ?? "",
                        role: res?.userLogin?.role ?? "",
                    }
                };
                setAuth(authData);
                message.success('Đăng nhập thành công!');
                navigate(redirectTo);
            } else {
                message.error('Email hoặc mật khẩu không chính xác!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi đăng nhập!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <Row gutter={[0, 0]} className="login-row">
                    <Col xs={24} md={12} className="login-left">
                        <div className="login-image-container">
                            <div className="login-welcome">
                                <UserOutlined className="welcome-icon" />
                                <Title level={2}>Chào mừng trở lại!</Title>
                                <Paragraph>
                                    Đăng nhập để tiếp tục học tập và phát triển kỹ năng của bạn.
                                </Paragraph>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} md={12} className="login-right">
                        <div className="login-form-container">
                            <div className="login-header">
                                <Title level={3}>Đăng nhập</Title>
                                <Text type="secondary">
                                    Nhập thông tin đăng nhập của bạn để tiếp tục
                                </Text>
                            </div>

                            <Form
                                layout="vertical"
                                onFinish={onFinish}
                                className="login-form"
                            >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập vào email!' },
                                        { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="site-form-item-icon" />}
                                        placeholder="Email"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập vào mật khẩu!' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        placeholder="Mật khẩu"
                                        size="large"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                        size="large"
                                        className="login-button"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider plain>
                                <Text type="secondary">Hoặc</Text>
                            </Divider>

                            {/* <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Button block size="large" className="social-button google-button">
                                    Đăng nhập với Google
                                </Button>
                                <Button block size="large" className="social-button facebook-button">
                                    Đăng nhập với Facebook
                                </Button>
                            </Space> */}
                            <div className='register-link'>
                                <Typography.Text>
                                    Bạn chưa có tài khoản?
                                    <Button color="primary" variant="link" onClick={() => { navigate("/register", { state: { from: redirectTo }, replace: true }); }}>Đăng ký ngay</Button>
                                </Typography.Text>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <style>{`
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f5f8fa;
                    padding: 20px;
                }
                
                .login-box {
                    width: 100%;
                    max-width: 900px;
                    background-color: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                
                .login-row {
                    min-height: 600px;
                }
                
                .login-left {
                    background: linear-gradient(135deg, #1890ff, #0050b3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .login-image-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    color: white;
                    text-align: center;
                    padding: 40px;
                }
                
                .login-welcome {
                    z-index: 2;
                    position: relative;
                }
                
                .welcome-icon {
                    font-size: 64px;
                    margin-bottom: 24px;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 20px;
                    border-radius: 50%;
                }
                
                .login-image-container h2 {
                    color: white !important;
                    margin-bottom: 16px;
                }
                
                .login-image-container p {
                    color: rgba(255, 255, 255, 0.9) !important;
                    font-size: 16px;
                }
                
                .login-right {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                }
                
                .login-form-container {
                    width: 100%;
                    max-width: 360px;
                }
                
                .login-header {
                    margin-bottom: 24px;
                    text-align: center;
                }
                
                .login-form {
                    margin-top: 24px;
                }
                
                .login-options {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 24px;
                }
                
                .forgot-password {
                    font-size: 14px;
                }
                
                .login-button {
                    height: 48px;
                    font-size: 16px;
                    font-weight: 500;
                    margin-top: 16px;
                }
                
                .social-button {
                    height: 48px;
                    font-size: 14px;
                    border-radius: 6px;
                }
                
                .google-button {
                    background-color: #ffffff;
                    color: rgba(0, 0, 0, 0.85);
                    border: 1px solid #e6e6e6;
                }
                
                .google-button:hover {
                    background-color: #f5f5f5;
                    border-color: #d9d9d9;
                }
                
                .facebook-button {
                    background-color: #1877f2;
                    color: #ffffff;
                    border: none;
                }
                
                .facebook-button:hover {
                    background-color: #166fe5;
                }
                
                .register-link {
                    margin-top: 24px;
                    text-align: center;
                }
                
                /* Responsive Styles */
                @media (max-width: 768px) {
                    .login-left {
                        display: none;
                    }
                    
                    .login-right {
                        padding: 40px 20px;
                    }
                }
                
                /* Form Icons Styling */
                .site-form-item-icon {
                    color: rgba(0, 0, 0, 0.45);
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
