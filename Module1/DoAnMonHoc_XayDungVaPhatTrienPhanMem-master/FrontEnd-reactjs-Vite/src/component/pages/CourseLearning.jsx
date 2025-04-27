import React, { useContext, useEffect, useState } from 'react';
import { Layout, Typography, Button, Card, Alert, List, Tag, Spin } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { GetLessonList } from '../../ultill/lessonApi';
import { AuthContext } from '../context/auth.context';
import { GetInforUser } from '../../ultill/userApi';

const { Content } = Layout;
const { Title, Text } = Typography;

const CourseLearning = () => {
    const { id } = useParams();
    const [videoError, setVideoError] = useState(false);
    const [currentVideo, setCurrentVideo] = useState({});
    const [lessons, setLessons] = useState([]);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleVideoError = () => {
        setVideoError(true);
    };

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const userInfor = await GetInforUser(auth?.user?.id);
                if (!userInfor?.enrolledCourses?.includes(id)) {
                    navigate(`/course-detail/${id}`);
                }
                const res = await GetLessonList(id);
                if (!Array.isArray(res)) {
                    throw new Error("Dữ liệu trả về không phải là mảng!");
                }
                const sortedLessons = res.sort((a, b) => a.order - b.order);
                setLessons(sortedLessons);

                // Tìm bài học đầu tiên chưa bị xóa mềm để hiển thị
                const firstActiveLesson = sortedLessons.find(lesson => !lesson.deleted);
                if (firstActiveLesson) {
                    setCurrentVideo(firstActiveLesson);
                } else if (sortedLessons.length > 0) {
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchLessons();
    }, [id]);

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

    // Hàm để chuyển đến bài học trước đó không bị xóa mềm
    const goToPreviousLesson = () => {
        const currentIndex = lessons.findIndex(lesson => lesson._id === currentVideo._id);
        if (currentIndex > 0) {
            // Tìm bài học trước đó chưa bị xóa mềm
            for (let i = currentIndex - 1; i >= 0; i--) {
                if (!lessons[i].deleted) {
                    setVideoError(false);
                    setCurrentVideo(lessons[i]);
                    return;
                }
            }
        }
    };

    // Hàm để chuyển đến bài học tiếp theo không bị xóa mềm
    const goToNextLesson = () => {
        const currentIndex = lessons.findIndex(lesson => lesson._id === currentVideo._id);
        if (currentIndex < lessons.length - 1) {
            // Tìm bài học tiếp theo chưa bị xóa mềm
            for (let i = currentIndex + 1; i < lessons.length; i++) {
                if (!lessons[i].deleted) {
                    setVideoError(false);
                    setCurrentVideo(lessons[i]);
                    return;
                }
            }
        }
    };

    // Kiểm tra xem có bài học trước đó không bị xóa mềm không
    const hasPreviousLesson = () => {
        const currentIndex = lessons.findIndex(lesson => lesson._id === currentVideo._id);
        for (let i = currentIndex - 1; i >= 0; i--) {
            if (!lessons[i].deleted) {
                return true;
            }
        }
        return false;
    };

    // Kiểm tra xem có bài học tiếp theo không bị xóa mềm không
    const hasNextLesson = () => {
        const currentIndex = lessons.findIndex(lesson => lesson._id === currentVideo._id);
        for (let i = currentIndex + 1; i < lessons.length; i++) {
            if (!lessons[i].deleted) {
                return true;
            }
        }
        return false;
    };

    return (
        <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {/* Cột trái: Video và chi tiết bài học */}
            <div style={{ flex: 2, paddingRight: '20px' }}>
                <Card>
                    {videoError ? (
                        <Alert
                            message="Không thể tải video"
                            description="Có vẻ như đã xảy ra sự cố khi tải video. Vui lòng thử lại sau hoặc kiểm tra kết nối internet của bạn."
                            type="error"
                            showIcon
                        />
                    ) : currentVideo.deleted ? (
                        <Alert
                            message="Bài học không khả dụng"
                            description="Bài học này hiện không khả dụng. Vui lòng chọn bài học khác."
                            type="warning"
                            showIcon
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                paddingTop: '56.25%',
                                position: 'relative',
                                backgroundColor: '#f0f0f0'
                            }}
                        >
                            <iframe
                                src={currentVideo?.video_id ? `https://www.youtube.com/embed/${currentVideo.video_id}` : ""}
                                title={currentVideo?.title || "Video"}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onError={handleVideoError}
                            />
                        </div>
                    )}

                    {/* Video Details */}
                    <Content style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: '10px' }}>
                            {currentVideo.title}
                            {currentVideo.deleted && (
                                <Tag color="red" style={{ marginLeft: '10px' }}>
                                    Đã bị vô hiệu hóa
                                </Tag>
                            )}
                        </Title>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            <Text type="secondary">
                                <CalendarOutlined style={{ marginRight: '8px' }} />
                                Cập nhật {new Date(currentVideo.updatedAt).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}
                            </Text>
                        </div>
                    </Content>
                </Card>

                {/* Course Navigation */}
                <div
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        gap: '20px' // Khoảng cách giữa hai nút
                    }}
                >
                    <Button
                        disabled={!hasPreviousLesson()} // Vô hiệu hóa nếu không có bài học trước đó không bị xóa mềm
                        onClick={goToPreviousLesson}
                    >
                        Bài trước
                    </Button>

                    <Button
                        type="primary"
                        disabled={!hasNextLesson()} // Vô hiệu hóa nếu không có bài học tiếp theo không bị xóa mềm
                        onClick={goToNextLesson}
                    >
                        Bài tiếp theo
                    </Button>
                </div>
            </div>

            {/* Cột phải: Danh sách các bài học */}
            <div style={{ flex: 1 }}>
                <Card title="Danh sách bài học" style={{ height: '100%' }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={lessons}
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    cursor: item.deleted ? 'not-allowed' : 'pointer',
                                    backgroundColor: currentVideo._id === item._id ? '#e6f7ff' : 'transparent',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    opacity: item.deleted ? 0.5 : 1
                                }}
                                onClick={() => {
                                    if (!item.deleted) {
                                        setVideoError(false);
                                        setCurrentVideo(item);
                                    }
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={item.lesson_img || `https://i.ytimg.com/vi/${item.video_id}/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCvhOydCVOREo2vIDNsS1lXKWwQgA`}
                                                alt="Thumbnail"
                                                style={{
                                                    width: '100px',
                                                    height: '60px',
                                                    borderRadius: '5px',
                                                    objectFit: 'cover',
                                                    filter: item.deleted ? 'grayscale(100%)' : 'none'
                                                }}
                                            />
                                            {item.deleted && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    fontSize: '10px'
                                                }}>
                                                    Vô hiệu hóa
                                                </div>
                                            )}
                                        </div>
                                    }
                                    title={
                                        <>
                                            {item.title}
                                            {item.deleted && (
                                                <Tag color="red" style={{ marginLeft: '8px' }}>
                                                    Bài học bị ẩn
                                                </Tag>
                                            )}
                                        </>
                                    }
                                    description={`Cập nhật ${new Date(item.updatedAt).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}`}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        </div>
    );
};

export default CourseLearning;
