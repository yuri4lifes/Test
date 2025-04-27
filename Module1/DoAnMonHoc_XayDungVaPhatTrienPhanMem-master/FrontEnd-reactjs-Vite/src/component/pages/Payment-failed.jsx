import React, { useEffect, useState } from 'react';
import { Result, Button, Typography, Card, Tag, Spin, Space } from 'antd';
import { HomeFilled, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { GetOrderDetail } from '../../ultill/orderApi';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const PaymentFailedPage = () => {
    const { id } = useParams();
    const navigation = useNavigate();
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                const res = await GetOrderDetail(id);
                if (res && res?.status === "Thất bại") {
                    setOrderDetails(res);
                    setLoading(false);
                    setTimeout(() => {
                        navigation("/");
                    }, 3000);
                }
            } catch (error) {
                setError('Không thể lấy thông tin đơn hàng');
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetail();
        }
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
        status: orderDetails.status || 'Thất bại',
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                {/* Failure Message */}
                <Result
                    icon={<div style={{
                        backgroundColor: '#ff4d4f',
                        borderRadius: '50%',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto',
                        boxShadow: '0 2px 8px rgba(255,77,79,0.2)'
                    }}>
                        <span style={{ color: 'white', fontSize: '40px' }}>✕</span>
                    </div>}
                    title={
                        <Title level={2} style={{ color: '#ff4d4f', textAlign: 'center', margin: '16px 0' }}>
                            Thanh toán không thành công!
                        </Title>
                    }
                    subTitle={
                        <>
                            <Paragraph style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>
                                Giao dịch của bạn đã bị từ chối hoặc gặp sự cố.
                            </Paragraph>
                            <Paragraph style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>
                                Bạn sẽ được chuyển hướng đến trang chủ trong giây lát.
                            </Paragraph>
                        </>
                    }
                    style={{ padding: '24px 0' }}
                />

                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '4px', height: '16px', backgroundColor: '#1890ff', marginRight: '8px' }}></div>
                            <Text strong style={{ fontSize: '16px' }}>Thông tin đơn hàng</Text>
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
                                <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(paymentDetails.amount)}
                                </Text>
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
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Ngày giao dịch</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                <Text>
                                    {new Date(paymentDetails.date).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                                <Text type="secondary">Trạng thái</Text>
                            </div>
                            <div style={{ display: 'table-cell', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                <Tag color="red">{paymentDetails.status}</Tag>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
