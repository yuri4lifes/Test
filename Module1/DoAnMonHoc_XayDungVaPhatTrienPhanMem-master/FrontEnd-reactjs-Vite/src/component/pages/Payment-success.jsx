import React, { useEffect, useState } from 'react';
import { Result, Typography, Card, Tag, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GetOrderDetail } from '../../ultill/orderApi';
import { CourseUpdate, GetCourse } from '../../ultill/courseApi';
import { GetInforUser, UpdateUser } from '../../ultill/userApi';
import { createActivitie } from '../../ultill/acctivitieApi';

const { Title, Text, Paragraph } = Typography;

const PaymentSuccessPage = () => {
    const { id } = useParams();
    const navigation = useNavigate();
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const enrollCourse = async (course_id, user_id) => {
        try {
            const userInfor = await GetInforUser(user_id);
            const newListEnroll = userInfor?.enrolledCourses || [];
            const course = await GetCourse(course_id);

            newListEnroll.push(course_id);
            userInfor.enrolledCourses = newListEnroll;
            const userUpdateRes = await UpdateUser(userInfor);

            const acctivitie = {
                type: "register_course",
                userName: userInfor?.name || "User-name",
                courseName: course?.name || "Course-name"
            };
            await createActivitie(acctivitie);

            const students = course.students || [];
            if (!students.includes(userInfor._id)) {
                students.push(userInfor._id);
                course.students = students;
                const courseUpdateRes = await CourseUpdate(course_id, course);
                if (userUpdateRes?.modifiedCount > 0 && courseUpdateRes.modifiedCount > 0) {
                    setTimeout(() => {
                        navigation(`/course-learning/${course_id}`);
                    }, 3000);
                }
            }
        } catch (error) {
            console.error("Lỗi trong enrollCourse:", error);
        }
    };

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                const res = await GetOrderDetail(id);

                if (res && res?.status === "Hoàn thành") {
                    setOrderDetails(res);
                    setLoading(false);
                    enrollCourse(res.course_id, res.user_id);
                }
            } catch (error) {
                setError('Không thể lấy thông tin đơn hàng');
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetail();
        }
    }, []);

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

    if (error) {
        return (
            <Result
                status="error"
                title="Không thể tải thông tin đơn hàng"
                subTitle={error}
            />
        );
    }

    const paymentDetails = {
        orderId: orderDetails._id || 'N/A',
        transactionId: orderDetails.bankTranNo || 'N/A',
        amount: orderDetails.amount || 0,
        paymentMethod: orderDetails.cardType || 'VNPay',
        date: orderDetails.updatedAt,
        status: orderDetails.status || 'Thành công',
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                <Result
                    icon={<div style={{
                        backgroundColor: '#52c41a',
                        borderRadius: '50%',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto'
                    }}>
                        <span style={{ color: 'white', fontSize: '40px' }}>✓</span>
                    </div>}
                    title={
                        <Title level={2} style={{ color: '#52c41a', textAlign: 'center' }}>
                            Thanh toán thành công!
                        </Title>
                    }
                    subTitle={
                        <>
                            <Paragraph style={{ textAlign: 'center' }}>
                                Cảm ơn bạn đã đăng ký khóa học. Giao dịch của bạn đã được xử lý thành công qua VNPay.
                            </Paragraph>
                            <Paragraph style={{ textAlign: 'center' }}>
                                Bạn sẽ được chuyển đến trang khóa học trong giây lát.
                            </Paragraph>
                        </>
                    }
                    style={{ padding: '24px 0' }}
                />

                {/* Order Details Card */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '4px', height: '16px', backgroundColor: '#1890ff', marginRight: '8px' }}></div>
                            <Text strong>Thông tin đơn hàng</Text>
                        </div>
                    }
                    style={{ margin: '20px', borderRadius: '4px' }}
                    styles={{ padding: '0' }}
                >
                    <div style={{ display: 'table', width: '100%', borderCollapse: 'collapse' }}>
                        <div style={{ display: 'table-row' }}>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', width: '25%', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Mã đơn hàng</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', width: '25%' }}>
                                <Text>{paymentDetails.orderId}</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', width: '25%', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Số tiền</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', width: '25%' }}>
                                <Text style={{ color: '#52c41a', fontWeight: 'bold' }}> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(paymentDetails.amount)}</Text>
                            </div>
                        </div>

                        <div style={{ display: 'table-row' }}>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Phương thức thanh toán</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                <Tag color="blue">{paymentDetails.paymentMethod}</Tag>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Mã giao dịch</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                <Text>{paymentDetails.transactionId}</Text>
                            </div>
                        </div>

                        <div style={{ display: 'table-row' }}>
                            <div style={{ display: 'table-cell', padding: '16px', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Ngày thanh toán</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px' }}>
                                <Text>{new Date(paymentDetails.date).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Trạng thái</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px' }}>
                                <Tag color="green">{paymentDetails.status}</Tag>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;