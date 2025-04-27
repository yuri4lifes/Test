// LessonManager.jsx
import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Typography,
    Space,
    Popconfirm,
    Tooltip,
    Empty,
    Divider
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    UndoOutlined,
    EditOutlined
} from '@ant-design/icons';
import { GetLessonList, LessonCreate, LessonDelete, LessonDestroy, LessonRestore, LessonUpdate } from "../../ultill/lessonApi";

const { Title } = Typography;
const { TextArea } = Input;

const LessonManager = ({ courseId }) => {
    const [form] = Form.useForm();
    const [lessons, setLessons] = useState([]);
    const [showAddLessonForm, setShowAddLessonForm] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [addingLesson, setAddingLesson] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Tải danh sách bài học
    const fetchLessons = async () => {
        try {
            const lessonList = await GetLessonList(courseId);
            setLessons(lessonList || []);
        } catch (error) {
            console.error("Không thể tải danh sách bài học:", error);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [courseId]);

    // Hiển thị form thêm bài học
    const handleAddLesson = () => {
        setShowAddLessonForm(true);
        setCurrentLessonId(null);
        setIsEditMode(false);
        form.resetFields();
        form.setFieldsValue({
            order: lessons.length + 1,
        });
    };

    // Mở form chỉnh sửa bài học
    const handleEditLesson = (lesson) => {
        setShowAddLessonForm(true);
        setCurrentLessonId(lesson._id);
        setIsEditMode(true);

        form.setFieldsValue({
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
                fetchLessons();
                message.success('Xóa bài học thành công.');
            }
        } catch (error) {
            message.error('Xóa bài học không thành công.');
        }
    };

    // Xóa bài học vĩnh viễn
    const handleDestroyLesson = async (lessonId) => {
        try {
            const res = await LessonDestroy(lessonId);
            if (res && res?.deletedCount > 0) {
                fetchLessons();
                message.success('Đã xóa vĩnh viễn bài học.');
            }
        } catch (error) {
            message.error('Xóa bài học không thành công.');
        }
    };

    // Khôi phục bài học
    const handleRestoreLesson = async (lessonId) => {
        try {
            const res = await LessonRestore(lessonId);
            if (res && res?.modifiedCount > 0) {
                fetchLessons();
                message.success('Bài học đã được khôi phục.');
            }
        } catch (error) {
            message.error('Khôi phục bài học không thành công.');
        }
    };

    // Xử lý lưu bài học
    const handleSaveLesson = async (values) => {
        try {
            setAddingLesson(true);
            const lessonData = {
                course_id: courseId,
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
            } else {
                const res = await LessonCreate(lessonData);
                if (res?.EC === 0) {
                    message.success("Tạo mới bài học thành công.");
                }
            }

            fetchLessons();
            setShowAddLessonForm(false);
            setIsEditMode(false);
            setCurrentLessonId(null);
            form.resetFields();
        } catch (error) {
            message.error(isEditMode ? 'Không thể cập nhật bài học.' : 'Không thể thêm bài học.');
        } finally {
            setAddingLesson(false);
        }
    };

    // Hủy thêm/sửa bài học
    const handleCancelForm = () => {
        setShowAddLessonForm(false);
        setIsEditMode(false);
        setCurrentLessonId(null);
    };

    // Render danh sách bài học
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
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
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

                                {!lesson?.deleted ? (
                                    <div style={{ display: 'flex', gap: '8px' }}>
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
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: "8px" }}>
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
                                    </div>
                                )}
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
            </div>
        );
    };

    return (
        <div>
            {showAddLessonForm ? (
                <div>
                    <Divider>
                        <Title level={5}>{isEditMode ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</Title>
                    </Divider>
                    <Form
                        form={form}
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
                                    onClick={handleCancelForm}
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
            ) : (
                renderLessonsList()
            )}
        </div>
    );
};

export default LessonManager;