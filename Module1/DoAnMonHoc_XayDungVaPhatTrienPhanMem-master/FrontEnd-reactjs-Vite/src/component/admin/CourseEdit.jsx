// Thêm các import cần thiết
import { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GetLessonList, LessonCreate, LessonDelete, LessonDestroy, LessonRestore, LessonUpdate } from "../../ultill/lessonApi";
import { CourseUpdate, GetCourse } from "../../ultill/courseApi";
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    Radio,
    Card,
    Typography,
    Row,
    Col,
    InputNumber,
    Space,
    Modal,
    Empty,
    Divider,
    Popconfirm,
    Tooltip,
    Spin
} from 'antd';
import {
    UploadOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    PictureOutlined,
    LinkOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    DeleteOutlined,
    UndoOutlined,
    EditOutlined
} from '@ant-design/icons';
import { AuthContext } from "../context/auth.context";


const { Title } = Typography;
const { TextArea } = Input;

const CourseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [lessonForm] = Form.useForm();
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUploadMethod, setImageUploadMethod] = useState('url');
    const [lessons, setLessons] = useState([]);
    const [showAddLessonForm, setShowAddLessonForm] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [addingLesson, setAddingLesson] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // Thêm trạng thái cho chế độ chỉnh sửa

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
        setShowAddLessonForm(false);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setShowAddLessonForm(false);
        setIsEditMode(false); // Reset trạng thái chỉnh sửa
        lessonForm.resetFields();
    };

    // Tải dữ liệu khóa học
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await GetCourse(id);
                const courseLessonList = await GetLessonList(id);
                if (!response || !response._id) {
                    message.error('Không tìm thấy khóa học.');
                    return;
                }

                form.setFieldsValue({
                    name: response.name,
                    description: response.description,
                    courseImage: response.course_img,
                    courseType: response.price === 0 ? 'free' : 'paid',
                    price: response.price || 0,
                });
                setImageUrl(response.course_img);
                setLessons(courseLessonList || []);
                setLoading(false);
            } catch (error) {
                message.error('Không thể tải thông tin khóa học.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, form]);

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

    // Upload ảnh từ máy tính
    const handleImageUpload = async (info) => {
        if (info.file.status === 'uploading') {
            message.loading({ content: 'Đang tải ảnh...', key: 'upload' });
            return;
        }

        if (info.file.status === 'done') {
            message.success({ content: 'Tải ảnh thành công.', key: 'upload' });
            const fullImageUrl = `${import.meta.env.VITE_BACKEND_URL}${info.file.response.filePath}`;
            setImageUrl(fullImageUrl);
            form.setFieldsValue({ courseImage: fullImageUrl });
        } else if (info.file.status === 'error') {
            message.error({ content: 'Tải ảnh thất bại.', key: 'upload' });
        }
    };

    // Hiển thị form thêm bài học
    const handleAddLesson = () => {
        setShowAddLessonForm(true);
        setCurrentLessonId(null);
        setIsEditMode(false); // Đảm bảo rằng đang ở chế độ thêm mới
        lessonForm.resetFields();
        lessonForm.setFieldsValue({
            order: lessons.length + 1,
        });
    };

    // Mở form chỉnh sửa bài học
    const handleEditLesson = (lesson) => {
        setShowAddLessonForm(true);
        setCurrentLessonId(lesson._id);
        setIsEditMode(true); // Chuyển sang chế độ chỉnh sửa

        // Đặt dữ liệu bài học vào form
        lessonForm.setFieldsValue({
            order: lesson.order,
            title: lesson.title,
            videoId: lesson.video_id,
            content: lesson.content
        });
    };

    // Xóa bài học
    const handleDeleteLesson = async (lessonId) => {
        try {
            const res = await LessonDelete(lessonId);
            if (res && res?.modifiedCount > 0) {
                const updatedLessons = await GetLessonList(id);
                setLessons(updatedLessons || []);
                message.success('Xóa bài học thành công.');
            }
        } catch (error) {
            message.error('Xóa bài học không thành công.');
        }
    };

    // Xóa bài học
    const handleDestroyLesson = async (lessonId) => {
        try {
            const res = await LessonDestroy(lessonId);
            if (res && res?.deletedCount > 0) {
                const updatedLessons = await GetLessonList(id);
                setLessons(updatedLessons || []);
                message.success('Đã xóa vĩnh viễn bài học.');
            }
        } catch (error) {
            message.error('Xóa bài học không thành công.');
        }
    };

    const handleRestoreLesson = async (lessonId) => {
        try {
            const res = await LessonRestore(lessonId);
            if (res && res?.modifiedCount > 0) {
                const updatedLessons = await GetLessonList(id);
                setLessons(updatedLessons || []);
                message.success('Bài học đã được khôi phục.');
            }
        } catch (error) {
            message.error('Khôi phục bài học không thành công.');
        }
    }

    // Xử lý lưu bài học
    const handleSaveLesson = async (values) => {
        try {
            setAddingLesson(true);
            const lessonData = {
                course_id: id,
                title: values.title,
                order: values.order,
                content: values.content,
                video_id: values.videoId
            };
            if (isEditMode && currentLessonId) {
                const res = await LessonUpdate(currentLessonId, lessonData);
                if (res && res?.modifiedCount > 0) {
                    message.success("Cập nhật thông tin bài học thành công.");
                }
            }
            else {
                const res = await LessonCreate(lessonData);
                if (res?.EC === 0) {
                    message.success("Tạo mới bài học thành công.");
                }
            }

            const updatedLessons = await GetLessonList(id);
            setLessons(updatedLessons || []);
            setShowAddLessonForm(false);
            setIsEditMode(false);
            setCurrentLessonId(null);
            lessonForm.resetFields();
        }
        catch (error) {
            message.error(isEditMode ? 'Không thể cập nhật bài học.' : 'Không thể thêm bài học.');
        } finally {
            setAddingLesson(false);
        }
    };

    // Xử lý khi submit form
    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);
            const formData = {
                name: values.name,
                description: values.description,
                course_img: values.courseImage,
                price: values.courseType === 'free' ? 0 : values.price,
            };
            const res = await CourseUpdate(id, formData);
            if (res?.modifiedCount > 0) {
                message.success("Cập nhật khóa học thành công.");
                auth?.user?.role === "admin" ? navigate("/manager/course") : navigate("/course-manager");
            } else {
                message.error("Cập nhật khóa học không thành công.");
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật khóa học.');
        } finally {
            setSubmitting(false);
        }
    };

    // Render phần danh sách bài học
    const renderLessonsList = () => {
        if (lessons.length === 0) {
            return (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Chưa có bài học nào. Hãy thêm bài học đầu tiên!"
                    />
                    <Button
                        type="primary"
                        onClick={handleAddLesson}
                        style={{ marginTop: "12px" }}
                        icon={<PlusOutlined />}
                    >
                        Thêm bài học
                    </Button>
                </div>
            );
        }

        return (
            <div>
                {[...lessons]
                    .sort((a, b) => a.order - b.order) // Sắp xếp theo thứ tự tăng dần
                    .map((lesson, index) => (
                        <div
                            key={lesson._id}
                            style={{
                                padding: "16px",
                                marginBottom: "8px",
                                border: "1px solid #f0f0f0",
                                borderRadius: "4px",
                                position: "relative"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div
                                    style={{
                                        backgroundColor: "#1890ff",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "12px"
                                    }}
                                >
                                    {lesson.order}
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <div style={{ fontWeight: "bold" }}>{lesson.title}</div>
                                    {lesson.video_id && <div style={{ color: "#888" }}>Video ID: {lesson.video_id}</div>}
                                </div>

                                {!lesson?.deleted ?
                                    (<div style={{ display: 'flex', gap: '8px' }}>
                                        <Tooltip title="Chỉnh sửa bài học">
                                            <Button
                                                type="default"
                                                size="small"
                                                onClick={() => handleEditLesson(lesson)}
                                            >
                                                <EditOutlined />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Xóa bài học">
                                            <Popconfirm
                                                title="Xóa bài học"
                                                description="Bạn muốn đưa bài học này vào thùng rác?"
                                                okText="Xóa"
                                                cancelText="Hủy"
                                                onConfirm={() => handleDeleteLesson(lesson._id)}
                                            >
                                                <Button danger size="small">
                                                    <DeleteOutlined />
                                                </Button>
                                            </Popconfirm>
                                        </Tooltip>
                                    </div>)
                                    :
                                    (<div style={{ display: "flex", gap: "8px" }}>
                                        <Tooltip title={"Khôi phục"}>
                                            <Button
                                                type="primary"
                                                icon={<UndoOutlined />}
                                                size="small"
                                                onClick={() => handleRestoreLesson(lesson._id)}
                                            ></Button>
                                        </Tooltip>

                                        <Tooltip title="Xóa vĩnh viễn bài học">
                                            <Popconfirm
                                                title="Xóa vĩnh viễn bài học"
                                                description="Xóa vĩnh viễn sẽ không thể khôi phục lại bài học!"
                                                okText="Xóa vĩnh viễn"
                                                cancelText="Hủy"
                                                onConfirm={() => handleDestroyLesson(lesson._id)}
                                            >
                                                <Button danger size="small">
                                                    <DeleteOutlined />
                                                </Button>
                                            </Popconfirm>
                                        </Tooltip>
                                    </div>)}

                            </div>
                        </div>
                    ))
                }

                <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <Button
                        type="dashed"
                        block
                        onClick={handleAddLesson}
                        icon={<PlusOutlined />}
                    >
                        Thêm bài học mới
                    </Button>
                </div>
            </div >
        );
    };

    // Render form thêm hoặc chỉnh sửa bài học
    const renderAddLessonForm = () => {
        return (
            <div>
                <Divider>
                    <Title level={5}>{isEditMode ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</Title>
                </Divider>
                <Form
                    form={lessonForm}
                    layout="vertical"
                    onFinish={handleSaveLesson}
                >
                    <Form.Item
                        label={<span>Thứ tự bài học</span>}
                        name="order"
                        rules={[{ required: true, message: 'Vui lòng nhập thứ tự bài học.' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={<span>Tiêu đề bài học</span>}
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học.' }]}
                    >
                        <Input placeholder="" />
                    </Form.Item>

                    <Form.Item
                        label={<span>Video ID</span>}
                        name="videoId"
                        rules={[{ required: true, message: 'Vui lòng nhập ID video.' }]}
                    >
                        <Input placeholder="" />
                    </Form.Item>

                    <Form.Item
                        label={<span>Nội dung bài học</span>}
                        name="content"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Nhập nội dung chi tiết của bài học"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="default"
                                onClick={() => {
                                    setShowAddLessonForm(false);
                                    setIsEditMode(false);
                                    setCurrentLessonId(null);
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={addingLesson}
                            >
                                {isEditMode ? 'Cập nhật bài học' : 'Lưu bài học'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        );
    };

    return (
        <div className="course-edit-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/manager/course')}
                            style={{ marginRight: '8px' }}
                        />
                        <span>Chỉnh sửa khóa học</span>
                        <Button
                            type="primary"
                            onClick={showModal}
                            icon={<UnorderedListOutlined />}
                        >
                            Quản lý bài học
                        </Button>
                        <Modal
                            title={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <UnorderedListOutlined style={{ marginRight: '8px' }} />
                                    {showAddLessonForm ? (isEditMode ? 'Chỉnh sửa bài học' : 'Thêm bài học mới') : 'Danh sách bài học'}
                                </div>
                            }
                            open={isModalOpen}
                            onCancel={handleCancel}
                            width={700}
                            footer={null}
                        >
                            {showAddLessonForm ? renderAddLessonForm() : renderLessonsList()}
                        </Modal>
                    </div>
                }
                style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.16)' }}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={submitting}>
                    <Row gutter={24}>
                        {/* Thông tin khóa học */}
                        <Col xs={24} md={14}>
                            <Card title={<Title level={5}>Thông tin khóa học</Title>} size="small">
                                <Form.Item name="name" label="Tên khóa học" rules={[{ required: true, message: 'Vui lòng nhập tên khóa học.' }]}>
                                    <Input placeholder="Nhập tên khóa học" />
                                </Form.Item>

                                <Form.Item name="description" label="Mô tả khóa học">
                                    <Input.TextArea placeholder="Mô tả chi tiết..." autoSize={{ minRows: 4 }} />
                                </Form.Item>

                                <Form.Item name="courseType" label="Loại khóa học">
                                    <Radio.Group>
                                        <Radio.Button value="paid">Có phí</Radio.Button>
                                        <Radio.Button value="free">Miễn phí</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item name="price" label="Giá khóa học" shouldUpdate>
                                    <InputNumber min={0} placeholder="Nhập giá khóa học" addonAfter="VNĐ" style={{ width: '100%' }} />
                                </Form.Item>
                            </Card>
                        </Col>

                        {/* Upload ảnh khóa học */}
                        <Col xs={24} md={10}>
                            <Card title={<Title level={5}><PictureOutlined /> Ảnh khóa học</Title>} size="small">
                                {/* Chọn phương thức thêm ảnh */}
                                <div style={{ marginBottom: '16px' }}>
                                    <Radio.Group
                                        value={imageUploadMethod}
                                        onChange={(e) => setImageUploadMethod(e.target.value)}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value="url">
                                            <Space>
                                                <LinkOutlined />
                                                Đường dẫn
                                            </Space>
                                        </Radio.Button>
                                        <Radio.Button value="upload">
                                            <Space>
                                                <UploadOutlined />
                                                Tải lên từ thiết bị
                                            </Space>
                                        </Radio.Button>
                                    </Radio.Group>
                                </div>

                                {/* Hiển thị phương thức theo lựa chọn */}
                                {imageUploadMethod === 'url' ? (
                                    <Form.Item name="courseImage" label="Đường dẫn ảnh">
                                        <Input
                                            onChange={(e) => {
                                                setImageUrl(e.target.value);
                                                form.setFieldsValue({ courseImage: e.target.value });
                                            }}
                                            placeholder="Nhập URL ảnh"
                                        />
                                    </Form.Item>
                                ) : (
                                    <>
                                        <Form.Item label="Tải ảnh từ thiết bị">
                                            <Upload.Dragger
                                                name="file"
                                                action={`${import.meta.env.VITE_BACKEND_URL}/v1/api/upload`}
                                                listType="picture"
                                                maxCount={1}
                                                headers={{
                                                    Authorization: `Bearer ${localStorage.getItem("token")}`
                                                }}
                                                onChange={handleImageUpload}
                                                beforeUpload={(file) => {
                                                    const isImage = file.type.startsWith('image/');
                                                    if (!isImage) {
                                                        message.error('Vui lòng chỉ tải lên tệp hình ảnh!');
                                                    }
                                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                                    if (!isLt2M) {
                                                        message.error('Hình ảnh phải nhỏ hơn 2MB!');
                                                    }
                                                    return isImage && isLt2M;
                                                }}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <UploadOutlined />
                                                </p>
                                                <p className="ant-upload-text">Nhấp hoặc kéo thả hình ảnh vào khu vực này</p>
                                                <p className="ant-upload-hint">
                                                    Hỗ trợ tải lên một hình ảnh, kích thước tối đa 2MB
                                                </p>
                                            </Upload.Dragger>
                                        </Form.Item>
                                        {/* Thêm Form.Item ẩn để lưu giá trị URL ảnh vào form */}
                                        <Form.Item name="courseImage" hidden>
                                            <Input />
                                        </Form.Item>
                                    </>
                                )}

                                {/* Hiển thị ảnh xem trước */}
                                {imageUrl && (
                                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                        <img
                                            src={imageUrl}
                                            alt="Ảnh khóa học"
                                            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: '16px' }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} block>
                            Cập nhật khóa học
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CourseEdit;