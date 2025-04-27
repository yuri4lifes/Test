import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Typography, Button, Card, Divider, message, Modal, Space, QRCode, Input, Tag, Spin } from 'antd';
import { AimOutlined, BookOutlined, LoadingOutlined, PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CourseUpdate, GetCourse } from '../../ultill/courseApi';
import { GetInforUser, UpdateUser } from '../../ultill/userApi';
import { AuthContext } from '../context/auth.context';
import { GetLessonList } from '../../ultill/lessonApi';
import { createActivitie } from '../../ultill/acctivitieApi';
import { GetQrUrl } from '../../ultill/paymentApi';
import { OrderCreate } from '../../ultill/orderApi';
const { Title, Paragraph, Text } = Typography;

const CourseDetail = () => {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const [courseDetails, setCourseDetail] = useState(null);
    const navigate = useNavigate();
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [isPayment, setIsPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrUrl, setQrUrl] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const course = await GetCourse(id);
                if (course) {
                    const lessons = await GetLessonList(id);
                    const teacher = await GetInforUser(course.teacher_id);
                    course.teacher_id = teacher.name;
                    course.lessons = lessons.length > 0 ? lessons : [];
                    setCourseDetail(course);
                }
            } catch (error) {
                console.error("Lỗi khi tải thông tin khóa học:", error);
            }
        };
        fetchCourse();
    }, []);

    if (!courseDetails) {
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

    const enrollCourse = async (course_id) => {
        try {
            // Kiểm tra xem khóa học đã được đăng ký chưa
            const userInfor = await GetInforUser(auth?.user?.id);
            const newListEnroll = userInfor?.enrolledCourses || [];

            // Cập nhật thông tin người dùng
            newListEnroll.push(course_id);
            userInfor.enrolledCourses = newListEnroll;
            const userUpdateRes = await UpdateUser(userInfor);

            //Lưu lại hành động
            const acctivitie = {
                type: "register_course",
                userName: auth?.user?.name || "User-name",
                courseName: courseDetails?.name || "Course-name"
            };
            await createActivitie(acctivitie);

            // Cập nhật danh sách học viên của khóa học
            const course = await GetCourse(course_id);
            const students = course.students || [];
            if (!students.includes(auth.user.id)) {
                students.push(auth.user.id);
                course.students = students;
                const courseUpdateRes = await CourseUpdate(course_id, course);
                if (userUpdateRes?.modifiedCount > 0 && courseUpdateRes.modifiedCount > 0) {
                    message.success("Đăng ký thành công.");
                    navigate(`/course-learning/${course_id}`);
                } else {
                    message.error("Đăng ký không thành công. Vui lòng thử lại.");
                }
            }
        } catch (error) {
            message.error("Có lỗi xảy ra. Vui lòng thử lại.");
            throw error;
        }
    };

    const onHandleEnroll = async (course_id) => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!auth?.user?.role) {
            message.info("Vui lòng đăng nhập để sử dụng chức năng này.");
            navigate("/login", { state: { from: location.pathname }, replace: true });
            return;
        }

        try {
            // Kiểm tra xem khóa học đã được đăng ký chưa
            const userInfor = await GetInforUser(auth?.user?.id);
            const newListEnroll = userInfor?.enrolledCourses || [];

            if (newListEnroll.includes(course_id)) {
                navigate(`/course-learning/${course_id}`);
                return;
            }

            // Kiểm tra xem khóa học có phí hay không
            if (courseDetails?.price > 0) {
                setIsPaymentModalVisible(true);
            } else {
                await enrollCourse(course_id);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const onHandlePayment = async () => {
        try {
            setLoading(true);
            const orderData = {
                amount: courseDetails.price,
                user_id: auth?.user?.id,
                course_id: courseDetails._id
            }
            const res = await OrderCreate(orderData);
            if (res && res._id) {
                const paymentData = {
                    vnp_Amount: courseDetails.price,
                    orderInfo: res._id,
                    vnp_ReturnUrl: `${import.meta.env.VITE_BACKEND_URL}/v1/api/vnpay-return`,
                    user_id: auth?.user?.id,
                    course_id: id,
                }
                const qrRes = await GetQrUrl(paymentData);
                if (qrRes && qrRes?.EC === 0) {
                    setQrUrl(qrRes?.vnpUrl);
                    setIsPayment(true);
                }
                setLoading(false);
            }
        } catch (error) {
            message.error("Lỗi hệ thống vui lòng thử lại sau.");
            setLoading(false);
        }
    }

    const onHandleCancelPayment = () => {
        setIsPaymentModalVisible(false);
        setIsPayment(false);
    }

    // Modal thanh toán với mã QR
    const PaymentModal = () => (
        <Modal
            title="Thanh toán khóa học"
            open={isPaymentModalVisible}
            onCancel={() => onHandleCancelPayment()}
            footer={[
                <Space key="footer-buttons" size={8}>
                    <Button key="back" onClick={() => onHandleCancelPayment()} disabled={loading}>
                        Hủy
                    </Button>
                    {isPayment ?
                        <>
                            <Link key="submit" to={qrUrl}>
                                <Button type="primary">
                                    Xác nhận thanh toán
                                </Button>
                            </Link>
                        </>
                        :
                        <>
                            <Button
                                type="primary"
                                onClick={() => onHandlePayment()}
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                            </Button>
                        </>
                    }
                </Space>
            ]}
            width={600}
        >
            <div style={{ padding: '12px 0' }}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px'
                        }}>
                            <Title level={4} style={{ margin: 0 }}>Thông tin thanh toán</Title>
                            <Text strong style={{ color: '#ff4d4f' }}>
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(courseDetails?.price)}
                            </Text>
                        </div>
                    </Col>

                    {isPayment ?
                        <>
                            <Col span={12}>
                                <Card size="small" variant="borderless" style={{ background: '#f9f9f9' }}>
                                    <div style={{ fontSize: '14px' }}>
                                        <div style={{ marginBottom: '8px' }}>
                                            <Text strong>Khóa học:</Text> {courseDetails?.name}
                                        </div>
                                        <div>
                                            <Text type="secondary">
                                                <Link to={qrUrl}>Thanh toán tại đây</Link>
                                            </Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <div className="text-center">
                                    <div className="mb-2">
                                        <Text>Quét mã QR để thanh toán với điện thoại</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Space direction="vertical" align="center">
                                            <QRCode value={qrUrl || '-'} />
                                        </Space>
                                    </div>
                                </div>
                            </Col>
                        </>
                        :
                        <></>}
                </Row>
            </div>
        </Modal>
    );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={2}>{courseDetails.name}</Title>
                        </Col>
                        <Col>
                            <Button
                                onClick={() => onHandleEnroll(courseDetails._id)}
                                type="primary"
                                size="large"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'initial',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2px 24px',
                                    height: 'auto',
                                    minHeight: '60px',
                                    borderRadius: '8px',
                                    fontWeight: 500,
                                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                            >
                                <span style={{ marginBottom: '4px', fontSize: '16px', }}>Đăng ký học</span>
                                <Tag color={courseDetails.price === 0 ? "green" : "orange"}>
                                    {courseDetails.price === 0 ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(courseDetails.price)}
                                </Tag>
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Paragraph>{courseDetails.description}</Paragraph>
                </Col>

                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        {/* Cột hình ảnh khóa học */}
                        <Col xs={24} md={12}>
                            <Card style={{ height: "100%" }}>
                                <img src={courseDetails.course_img || `${import.meta.env.VITE_BACKEND_URL}/uploads/no-img.png`} alt="Course"
                                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                />
                            </Card>
                        </Col>

                        {/* Cột thông tin khóa học */}
                        <Col xs={24} md={12}>
                            <Card title="Thông tin khóa học" style={{ height: "100%" }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <BookOutlined style={{ marginRight: 8 }} />
                                        <Text>{courseDetails?.lessons?.length || 0} bài học</Text>
                                    </div>
                                    <div>
                                        <UserOutlined style={{ marginRight: 8 }} />
                                        <Text>Giáo viên {courseDetails?.teacher_id || 'chưa cập nhật'}</Text>
                                    </div>
                                    <div>
                                        <PlayCircleOutlined style={{ marginRight: 8 }} />
                                        <Text>Học viên {courseDetails?.students?.length || 0}</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Card title="Nội dung khóa học">
                        {courseDetails.lessons.length > 0 ? (
                            courseDetails.lessons.map((lesson, index) => (
                                <React.Fragment key={lesson._id}>
                                    <Row justify="space-between" align="middle" style={{ padding: '12px 0' }}>
                                        <Col>
                                            <Text strong>Bài {index + 1}: {lesson.title}</Text>
                                        </Col>
                                    </Row>
                                    {index < courseDetails.lessons.length - 1 && <Divider style={{ margin: 0 }} />}
                                </React.Fragment>
                            ))
                        ) : (
                            <Text>Chưa có bài học nào</Text>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Thêm Modal thanh toán */}
            <PaymentModal />
        </div>
    );
};

export default CourseDetail;