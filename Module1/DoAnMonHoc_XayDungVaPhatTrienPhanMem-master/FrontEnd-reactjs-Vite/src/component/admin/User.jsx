import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Space, Card, Input, Select, Tag, Avatar, Typography, Popconfirm, message, Tooltip, Row, Col, Modal, Form, Spin } from 'antd';
import {
    SearchOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    UndoOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { deleteUser, destroyUser, GetListUser, restoreUser, UpdateUser } from '../../ultill/userApi';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const User = () => {
    const { authState } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await GetListUser();
            setUsers(res);
            applyFilters(res);
            setLoading(false);
        } catch (error) {
            message.error('Không thể tải danh sách người dùng');
            setLoading(false);
        }
    };

    const applyFilters = (data) => {
        let result = [...data];
        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }
        if (searchText) {
            result = result.filter(
                user =>
                    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        setFilteredUsers(result);
        setPagination(prev => ({
            ...prev,
            total: result.length,
        }));
    };

    useEffect(() => {
        applyFilters(users);
    }, [searchText, roleFilter]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <Spin size="large" tip="">
                    <div style={{ minHeight: 200 }}></div>
                </Spin>
            </div>
        );
    }

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleRoleFilterChange = (value) => {
        setRoleFilter(value);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const handleDelete = async (userId) => {
        try {
            const res = await deleteUser(userId);
            if (res && res.modifiedCount > 0) {
                message.success('Đã xóa người dùng thành công');
            }
            const updatedUsers = users.map(user =>
                user._id === userId ? { ...user, deleted: true, deletedAt: new Date().toISOString() } : user
            );
            setUsers(updatedUsers);
            applyFilters(updatedUsers);
        } catch (error) {
            message.error('Xóa người dùng không thành công');
        }
    };

    const handleRestore = async (userId) => {
        // Gọi API khôi phục người dùng
        try {
            const res = await restoreUser(userId);
            if (res && res.modifiedCount > 0) {
                message.success('Đã khôi phục người dùng thành công');
                const updatedUsers = users.map(user =>
                    user._id === userId ? { ...user, deleted: false, deletedAt: null } : user
                );
                setUsers(updatedUsers);
                applyFilters(updatedUsers);
            }
        } catch {
            message.success('Khôi phục người dùng không thành công');
        }
    };

    const handleDestroy = async (_id) => {
        try {
            const res = await destroyUser(_id);
            if (res && res?.deletedCount > 0) {
                message.success('Đã xóa vĩnh viễn người dùng.');
                const updatedUsers = users.filter(user => user._id !== _id);
                setUsers(updatedUsers);
                applyFilters(updatedUsers);
            }
        } catch {
            message.error('Xóa không thành công!');
        }
    }

    // Chỉnh sửa hàm handleEdit để mở modal
    const handleEdit = (userId) => {
        const user = users.find(user => user._id === userId);
        if (user) {
            setEditingUser(user);
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                role: user.role,
            });
            setIsEditModalVisible(true);
        }
    };

    // Thêm hàm xử lý khi submit form modal
    const handleEditSubmit = async (values) => {
        try {
            values._id = editingUser._id;
            const res = await UpdateUser(values);
            if (res && res?.modifiedCount) {
                // Cập nhật lại state users
                const updatedUsers = users.map(user =>
                    user._id === editingUser._id
                        ? { ...user, ...values }
                        : user
                );
                setUsers(updatedUsers);
                applyFilters(updatedUsers);
                message.success('Cập nhật người dùng thành công');
                setIsEditModalVisible(false);
            }
        } catch (error) {
            message.error('Không thể cập nhật người dùng');
        }
    };

    const roleColors = {
        admin: 'red',
        teacher: 'green',
        user: 'blue',
    };

    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={40}
                        src={record.avatar}
                        icon={<UserOutlined />}
                    />
                    <div>
                        <Text strong>{record.name}</Text>
                        <br />
                        <Text type="secondary">{record.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: role => (
                <Tag color={roleColors[role]}>
                    {role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giảng viên' : 'Học viên'}
                </Tag>
            ),
            filters: [
                { text: 'Quản trị viên', value: 'admin' },
                { text: 'Giảng viên', value: 'teacher' },
                { text: 'Học viên', value: 'user' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                record.deleted ? (
                    <Tag color="red">Đã xóa</Tag>
                ) : (
                    <Tag color="green">Hoạt động</Tag>
                )
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    {!record.deleted ? (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => handleEdit(record._id)}
                                disabled={authState?.user?.role !== 'admin' && record.role === 'admin'}
                            />
                            <Popconfirm
                                title="Bạn có muốn xóa người dùng này?"
                                onConfirm={() => handleDelete(record._id)}
                                okText="Xóa"
                                cancelText="Hủy"
                                disabled={authState?.user?.role !== 'admin' && record.role === 'admin'}
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    disabled={authState?.user?.role !== 'admin' && record.role === 'admin'}
                                />
                            </Popconfirm>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Khôi phục">
                                <Button
                                    type="primary"
                                    onClick={() => handleRestore(record._id)}
                                    icon={<UndoOutlined />}
                                    size="small"
                                />
                            </Tooltip>
                            <Tooltip title="Xóa vĩnh viễn">
                                <Popconfirm
                                    title="Bạn có muốn xóa vĩnh viễn người dùng này?"
                                    onConfirm={() => handleDestroy(record._id)}
                                    okText="Xóa vĩnh viễn"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        size="small"
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )
                    }
                </Space >
            ),
        },
    ];

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3}>Quản lý người dùng</Title>
                    </Col>
                    <Col>
                        <Space>
                            <Link to={"/manager/user-create"}>
                                <Button
                                    type="primary"
                                    icon={<UserAddOutlined />}
                                >
                                    Thêm người dùng
                                </Button>
                            </Link>
                        </Space>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc email"
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={e => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Lọc theo vai trò"
                            style={{ width: '100%' }}
                            onChange={handleRoleFilterChange}
                            defaultValue="all"
                        >
                            <Option value="all">Tất cả vai trò</Option>
                            <Option value="admin">Quản trị viên</Option>
                            <Option value="teacher">Giảng viên</Option>
                            <Option value="user">Học viên</Option>
                        </Select>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="_id"
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Space>
            <Modal
                title="Chỉnh sửa thông tin người dùng"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên người dùng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input placeholder="Nhập tên người dùng" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Option value="user">Học viên</Option>
                            <Option value="teacher">Giảng viên</Option>
                            <Option value="admin">Quản trị viên</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                            <Button onClick={() => setIsEditModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card >
    );
};

export default User;