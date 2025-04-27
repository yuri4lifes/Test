import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    Avatar,
    Typography,
    Tabs,
    Button,
    Form,
    Input,
    Select,
    Upload,
    List,
    Space,
    Tag,
    message,
    Radio,
    Row,
    Col,
    Divider,
    Modal,
    Flex
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    EditOutlined,
    SaveOutlined,
    UploadOutlined,
    ReadOutlined,
    BookOutlined,
    KeyOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone
} from '@ant-design/icons';
import { GetInforUser, GetListCourseByUser, GetListCouserEnrolled, passwordChance, UpdateUser } from '../../ultill/userApi';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
    // State cho thông tin người dùng
    const [user, setUser] = useState({});
    const { auth, setAuth } = useContext(AuthContext);

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [createdCourses, setCreatedCourses] = useState([]);

    const [uploadType, setUploadType] = useState('upload');
    const [imageUrl, setImageUrl] = useState('');
    // State cho chế độ chỉnh sửa - ban đầu là false (không được chỉnh sửa)
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

    useEffect(() => {
        setUser(auth.user);
    }, [])

    useEffect(() => {
        // Reset form khi user thay đổi
        form.setFieldsValue(user);
    }, [user, form]);

    const fectchListCourseByUser = async () => {
        try {
            const createdCoursesList = await GetListCourseByUser(auth?.user?.id);
            const enrolledCoursesList = await GetListCouserEnrolled(auth?.user?.id);

            setEnrolledCourses(enrolledCoursesList || []);
            setCreatedCourses(createdCoursesList || []);
        } catch (error) {

        }
    }

    useEffect(() => {
        fectchListCourseByUser();
    }, []);

    const handleUploadTypeChange = (e) => {
        setUploadType(e.target.value);
        setImageUrl('');
        form.setFieldsValue({ avatar: undefined });
        form.validateFields(['avatar']);
    };

    const uploadProps = {
        name: 'file',
        action: `${import.meta.env.VITE_BACKEND_URL}/v1/api/upload`,
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} upload thành công`);
                const fullImageUrl = `${import.meta.env.VITE_BACKEND_URL}${info.file.response.filePath}`;
                setImageUrl(fullImageUrl);
                form.setFieldsValue({ avatar: fullImageUrl });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} upload thất bại`);
            }
        },
    };

    // Xử lý bắt đầu chỉnh sửa
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Xử lý khi lưu thông tin
    const handleSave = () => {
        form.validateFields()
            .then(values => {
                const updatedValues = {
                    ...values,
                    avatar: values.avatar || imageUrl || user.avatar,
                    _id: auth.user.id
                };

                UpdateUser(updatedValues)
                    .then(() => {
                        const newUser = { ...user, ...updatedValues };
                        setUser(newUser); // Cập nhật state user
                        setAuth({ ...auth, user: newUser }); // Cập nhật context auth
                        message.success('Cập nhật thông tin thành công!');
                        setIsEditing(false);
                    })
                    .catch(error => {
                        message.error('Cập nhật thất bại: ' + error.message);
                    });
            })
            .catch(error => {
            });
    };

    // Xử lý khi hủy chỉnh sửa
    const handleCancel = () => {
        form.setFieldsValue(user);
        setIsEditing(false);
    };

    // Xử lý khi mở modal đổi mật khẩu
    const showPasswordModal = () => {
        passwordForm.resetFields();
        setIsPasswordModalVisible(true);
    };

    // Xử lý khi đóng modal đổi mật khẩu
    const handlePasswordModalCancel = () => {
        setIsPasswordModalVisible(false);
    };

    // Xử lý khi xác nhận đổi mật khẩu
    const handlePasswordChange = async () => {
        try {
            const values = await passwordForm.validateFields();
            const data = {
                email: auth?.user?.email,
                pass_old: values.currentPassword,
                pass_new: values.confirmPassword
            }
            const res = await passwordChance(data);
            if (res && res?.Success) {
                message.success(res?.Success ?? "Mật khẩu đã được thay đổi!");
                setIsPasswordModalVisible(false);
            }
            else {
                message.error(res?.Error ?? "Không thể cập nhật mật khẩu!");
            }
        } catch (error) {

        }
    };

    const roleLabels = {
        'user': 'Học viên',
        'teacher': 'Giảng viên',
        'admin': 'Quản trị viên'
    };

    // Component hiển thị thông tin cá nhân
    const PersonalInfo = () => (
        <Row gutter={[24, 16]}>
            <Col xs={24} sm={16}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={user}
                    disabled={!isEditing}
                >
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" disabled />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            {!isEditing ? (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={handleEdit}
                                        disabled={false}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        type="default"
                                        icon={<KeyOutlined />}
                                        onClick={showPasswordModal}
                                        disabled={false}
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                    <Button onClick={handleCancel}>Hủy</Button>
                                </>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Col>
            <Col xs={24} sm={8}>
                {isEditing && (
                    <div style={{ marginBottom: 16 }}>
                        <Title level={5}>Ảnh đại diện</Title>
                        <Radio.Group
                            value={uploadType}
                            onChange={handleUploadTypeChange}
                            style={{ marginBottom: 16 }}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="upload">Tải ảnh lên</Radio.Button>
                            <Radio.Button value="url">Nhập URL</Radio.Button>
                        </Radio.Group>

                        {uploadType === 'upload' ? (
                            <Upload {...uploadProps} listType="picture-card" maxCount={1}>
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                                </div>
                            </Upload>
                        ) : (
                            <Input
                                placeholder="Nhập URL ảnh"
                                onChange={(e) => {
                                    const inputUrl = e.target.value;
                                    setImageUrl(inputUrl);
                                    form.setFieldsValue({ avatar: inputUrl });
                                }}
                                value={imageUrl}
                            />
                        )}
                    </div>
                )}
            </Col>
        </Row>
    );

    // Component hiển thị khóa học đã đăng ký
    const EnrolledCourses = () => (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4}>Khóa học đã đăng ký</Title>
                <Link to={"/course"}><Button type="primary" ghost>Xem khóa học</Button></Link>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={enrolledCourses || []}
                locale={{ emptyText: 'Bạn chưa tạo khóa học nào' }}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Link to={`/course-detail/${item._id}`}>
                                <Button type="primary" ghost>
                                    Xem chi tiết khóa học
                                </Button>
                            </Link>,
                        ]}
                        style={{
                            background: '#f5f5f5',
                            marginBottom: 8,
                            padding: '12px 16px',
                            borderRadius: 8,
                        }}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    shape="square"
                                    size={64}
                                    src={item.course_img || <BookOutlined />}
                                />
                            }
                            title={
                                <span style={{ fontSize: 16, fontWeight: 500 }}>
                                    {item.name}
                                </span>
                            }
                            description={
                                <>
                                    <div>Giá: {item.price === 0 ? 'Miễn phí' : `${item.price.toLocaleString()} VNĐ`}</div>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );

    // Component hiển thị khóa học đã tạo (cho giảng viên)
    const CreatedCourses = () => (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4}>Khóa học đã tạo</Title>
                <Link to={"/manager/create"}><Button type="primary">Tạo khóa học mới</Button></Link>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={createdCourses || []}
                locale={{ emptyText: 'Bạn chưa tạo khóa học nào' }}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Link to={`/course-detail/${item._id}`}>
                                <Button type="primary" ghost>
                                    Xem chi tiết khóa học
                                </Button>
                            </Link>,
                            <Link to={`/course-edit/${item._id}`}>
                                <Button type="primary" ghost>
                                    Chỉnh sửa
                                </Button>
                            </Link>,
                        ]}
                        style={{
                            background: '#f5f5f5',
                            marginBottom: 8,
                            padding: '12px 16px',
                            borderRadius: 8,
                        }}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    shape="square"
                                    size={64}
                                    src={item.course_img || <BookOutlined />}
                                />
                            }
                            title={
                                <span style={{ fontSize: 16, fontWeight: 500 }}>
                                    {item.name}
                                </span>
                            }
                            description={
                                <>
                                    <div>Số học viên: {item.students?.length || 0}</div>
                                    <div>Giá: {item.price === 0 ? 'Miễn phí' : `${item.price.toLocaleString()} VNĐ`}</div>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />

        </>
    );

    // Component hiển thị tab quản lý mật khẩu
    const SecurityManagement = () => (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <Card
                title={<span><LockOutlined /> Quản lý mật khẩu</span>}
                style={{ borderRadius: 8, marginBottom: 24 }}
            >
                <Text>Bạn có thể thay đổi mật khẩu để bảo vệ tài khoản của mình. Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</Text>
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Button
                        type="primary"
                        icon={<KeyOutlined />}
                        onClick={showPasswordModal}
                        size="large"
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </Card>
        </div>
    );

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
            <Card style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 24,
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Avatar
                        size={80}
                        icon={<UserOutlined />}
                        src={imageUrl || user.avatar}
                        style={{
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            border: '3px solid #fff'
                        }}
                    />
                    <div style={{ marginLeft: 24 }}>
                        <Title level={3} style={{ margin: 0 }}>{user.name}</Title>
                        <div style={{ marginTop: 4 }}>
                            <Tag color="blue" style={{ marginRight: 8 }}>{roleLabels[user.role]}</Tag>
                            <Tag color="geekblue">{user.email}</Tag>
                        </div>
                    </div>
                </div>
                <Tabs
                    defaultActiveKey="profile"
                    type="card"
                    size="large"
                    className="profile-tabs"
                    items={[
                        {
                            key: "profile",
                            label: (
                                <span style={{ display: 'flex', gap: '4px' }}>
                                    <UserOutlined />
                                    Thông tin cá nhân
                                </span>
                            ),
                            children: <PersonalInfo />,
                        },
                        {
                            key: "security",
                            label: (
                                <span style={{ display: 'flex', gap: '4px' }}>
                                    <LockOutlined />
                                    Bảo mật
                                </span>
                            ),
                            children: <SecurityManagement />,
                        },
                        {
                            key: "enrolled",
                            label: (
                                <span style={{ display: 'flex', gap: '4px' }}>
                                    <ReadOutlined />
                                    Khóa học đã đăng ký
                                </span>
                            ),
                            children: <EnrolledCourses />,
                        },
                        ...(user.role === "teacher" || user.role === "admin"
                            ? [
                                {
                                    key: "created",
                                    label: (
                                        <span style={{ display: 'flex', gap: '4px' }}>
                                            <BookOutlined />
                                            Khóa học đã tạo
                                        </span>
                                    ),
                                    children: <CreatedCourses />,
                                },
                            ]
                            : []),
                    ]}
                />
            </Card>

            {/* Modal đổi mật khẩu */}
            <Modal
                title={<span><KeyOutlined /> Đổi mật khẩu</span>}
                open={isPasswordModalVisible}
                onCancel={handlePasswordModalCancel}
                footer={[
                    <Button key="back" onClick={handlePasswordModalCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handlePasswordChange}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu hiện tại"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu mới"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập lại mật khẩu mới"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;