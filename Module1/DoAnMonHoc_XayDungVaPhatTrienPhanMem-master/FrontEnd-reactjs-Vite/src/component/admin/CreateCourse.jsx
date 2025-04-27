import React, { useContext, useState } from 'react';
import { Button, Form, Input, Upload, message, Radio, Card, Typography, Divider } from 'antd';
import { UploadOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';
import { CourseCreate } from '../../ultill/courseApi';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CreateCourse = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [uploadType, setUploadType] = useState('upload');
    const [courseType, setCourseType] = useState('free');
    const [form] = Form.useForm();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const finalValues = {
                ...values,
                teacher_id: auth.user.id,
                price: values.courseType === 'free' ? 0 : values.price
            };

            const { name, description, img, price, teacher_id } = finalValues;
            const res = await CourseCreate(name, description, img, price, teacher_id);

            if (res) {
                message.success('Tạo khóa học thành công!');
                if (auth?.user?.role === "admin") {
                    navigate("/manager/course");
                }
                else {
                    navigate("/course-manager");
                }
            } else {
                message.error(res?.message || 'Có lỗi xảy ra khi tạo khóa học!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo khóa học!');
        }
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
                form.setFieldsValue({ img: fullImageUrl });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} upload thất bại`);
            }
        },
    };

    const handleUploadTypeChange = (e) => {
        setUploadType(e.target.value);
        setImageUrl('');
        form.setFieldsValue({ img: undefined });
        form.validateFields(['img']);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 100px)',
            padding: '30px',
            background: '#f5f7fa'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: '550px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                title={
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <BookOutlined style={{ fontSize: '22px', color: '#1890ff' }} />
                            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>Tạo Mới Khóa Học</Title>
                        </div>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="create-course"
                    onFinish={onFinish}
                    initialValues={{
                        courseType: 'free'
                    }}
                    style={{ padding: '10px' }}
                >
                    <Form.Item
                        label={<Text strong>Tên khóa học</Text>}
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                    >
                        <Input placeholder="Nhập tên khóa học" size="large" />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>Mô tả khóa học</Text>}
                        name="description"
                    >
                        <Input.TextArea rows={4} placeholder="Mô tả chi tiết về nội dung khóa học..." />
                    </Form.Item>

                    <Divider style={{ margin: '16px 0' }} />

                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: '1', minWidth: '220px' }}>
                            <Form.Item
                                label={<div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <UploadOutlined style={{ color: '#722ed1' }} />
                                    <Text strong>Ảnh khóa học</Text>
                                </div>}
                                name="img"
                                rules={[
                                    { required: true, message: 'Vui lòng thêm ảnh khóa học!' },
                                    {
                                        validator: (_, value) => {
                                            if (!imageUrl) {
                                                return Promise.reject('Vui lòng thêm ảnh khóa học!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                                style={{ marginBottom: '10px' }}
                            >
                                <div>
                                    <Radio.Group
                                        value={uploadType}
                                        onChange={handleUploadTypeChange}
                                        style={{ marginBottom: '15px' }}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value="upload">Upload ảnh</Radio.Button>
                                        <Radio.Button value="url">Nhập URL</Radio.Button>
                                    </Radio.Group>

                                    {uploadType === 'upload' ? (
                                        <Upload {...uploadProps}>
                                            <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                                                Tải ảnh từ máy tính
                                            </Button>
                                        </Upload>
                                    ) : (
                                        <Input
                                            placeholder="Nhập URL ảnh"
                                            onChange={(e) => {
                                                const inputUrl = e.target.value;
                                                setImageUrl(inputUrl);
                                                form.setFieldsValue({ img: inputUrl });
                                            }}
                                            value={imageUrl}
                                        />
                                    )}
                                </div>
                            </Form.Item>
                        </div>

                        <div style={{ flex: '1', minWidth: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {imageUrl ? (
                                <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '8px', background: 'white' }}>
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        style={{
                                            width: '180px',
                                            height: '180px',
                                            objectFit: 'contain'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            message.error('Không thể tải ảnh. Vui lòng kiểm tra URL.');
                                            setImageUrl('');
                                            form.setFieldsValue({ img: undefined });
                                        }}
                                    />
                                </div>
                            ) : (
                                <div style={{
                                    border: '1px dashed #d9d9d9',
                                    borderRadius: '8px',
                                    width: '180px',
                                    height: '180px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: '#fafafa'
                                }}>
                                    <Text style={{ color: '#bbb' }}>Xem trước ảnh</Text>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{
                        background: '#f6ffed',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                        border: '1px solid #b7eb8f'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '5px' }}>
                            <DollarOutlined style={{ color: '#52c41a' }} />
                            <Text strong style={{ color: '#52c41a' }}>Thông Tin Giá</Text>
                        </div>

                        <Form.Item
                            label={<Text>Loại khóa học</Text>}
                            name="courseType"
                            style={{ marginBottom: '16px' }}
                        >
                            <Radio.Group
                                value={courseType}
                                onChange={(e) => {
                                    setCourseType(e.target.value);
                                    if (e.target.value === 'free') {
                                        form.setFieldsValue({ price: 0 });
                                    } else {
                                        form.setFieldsValue({ price: undefined });
                                    }
                                }}
                                buttonStyle="solid"
                            >
                                <Radio.Button value="paid" style={{ width: '120px', textAlign: 'center' }}>
                                    <DollarOutlined /> Có phí
                                </Radio.Button>
                                <Radio.Button value="free" style={{ width: '120px', textAlign: 'center' }}>
                                    Miễn phí
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        {courseType === 'paid' && (
                            <Form.Item
                                label={<Text>Giá (VNĐ)</Text>}
                                name="price"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá khóa học!' },
                                    { pattern: /^[0-9]+$/, message: 'Giá khóa học phải là số và lớn hơn 0!' },
                                    {
                                        validator: (_, value) => {
                                            if (value <= 0) {
                                                return Promise.reject('Giá khóa học phải lớn hơn 0!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Nhập giá khóa học"
                                    prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                                />
                            </Form.Item>
                        )}
                    </div>

                    <Divider style={{ margin: '16px 0' }} />

                    <Form.Item style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                onClick={() => navigate("/manager/course")}
                                size="large"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ minWidth: '150px' }}
                            >
                                Đăng khóa học
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateCourse;
