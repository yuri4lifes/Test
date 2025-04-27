// CreateUser.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, Alert, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { CreateNewUser } from '../../ultill/userApi';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CreateUser = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        setSuccess(false);

        try {
            // Mô phỏng API call
            const { name, email, password, role } = values;
            const res = await CreateNewUser(name, email, password, role);
            if (res && res.EC === 0) {
                form.resetFields();
                setSuccess(true);
                message.success('Người dùng đã được tạo thành công!');
                navigate("/manager/user");
            }
            else { message.error('Có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại.'); }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title={<div style={{ textAlign: 'center' }}>Thêm người dùng mới</div>}
            style={{ maxWidth: 500, margin: '0 auto' }}>
            {success && (
                <Alert
                    message="Thành công"
                    description="Người dùng đã được tạo thành công!"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                name="user_add_form"
                onFinish={onFinish}
                initialValues={{ role: 'user' }}
            >
                <Form.Item
                    name="name"
                    label="Tên người dùng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="example@email.com" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item name="role" label="Vai trò">
                    <Select placeholder="Chọn vai trò người dùng">
                        <Option value="user">Học viên</Option>
                        <Option value="teacher">Giảng viên</Option>
                        <Option value="admin">Quản trị viên</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Tạo mới
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default CreateUser;
