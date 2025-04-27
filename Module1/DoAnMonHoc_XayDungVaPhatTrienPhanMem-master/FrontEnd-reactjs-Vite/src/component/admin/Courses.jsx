import React, { useEffect, useState } from "react";
import {
    Empty, Typography, Button, Dropdown, Divider, Card, Row, Col,
    Tag, Tooltip, Space, Skeleton, Input, Select, message, Modal,
    Spin, Pagination
} from 'antd';
import {
    MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
    DeleteFilled, EyeOutlined, SearchOutlined,
    UserOutlined, BookOutlined, DollarOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { DeleteSoftCourse, GetCourseList } from "../../ultill/courseApi";
import { Link } from "react-router-dom";
import '../../styles/course.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('all');
    // Thêm state pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        total: 0
    });

    // Format giá tiền
    const formatPrice = (price) => {
        if (price === 0) return "Miễn phí";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };

    // Lấy danh sách khóa học
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await GetCourseList();
            if (res && Array.isArray(res)) {
                setCourses(res);
                setFilteredCourses(res);
                setPagination(prev => ({
                    ...prev,
                    total: res.length,
                }));
            } else {
                setCourses([]);
                setFilteredCourses([]);
                setPagination(prev => ({
                    ...prev,
                    total: 0,
                }));
            }
            setLoading(false);
        } catch (error) {
            message.error("Không thể tải danh sách khóa học");
        } finally {
            setLoading(false);
        }
    };

    // Gọi API lần đầu khi component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Lọc và tìm kiếm khóa học
    useEffect(() => {
        let result = [...courses];

        // Lọc theo giá
        if (filter === 'free') {
            result = result.filter(course => course.price === 0);
        } else if (filter === 'paid') {
            result = result.filter(course => course.price > 0);
        }

        // Tìm kiếm theo tên
        if (searchText) {
            result = result.filter(course =>
                course.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredCourses(result);
        setPagination(prev => ({
            ...prev,
            total: result.length,
            current: 1 // Reset về trang đầu khi filter thay đổi
        }));
    }, [searchText, filter, courses]);

    // Xử lý thay đổi trang
    const handleChangePage = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }));
    };

    // Lấy phần tử hiển thị theo trang hiện tại
    const getCurrentPageData = () => {
        const { current, pageSize } = pagination;
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredCourses.slice(startIndex, endIndex);
    };

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

    // Xác nhận xóa khóa học
    const showDeleteConfirm = (course) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa khóa học này?',
            icon: <ExclamationCircleOutlined />,
            content: `Khóa học "${course.name}" sẽ được chuyển vào thùng rác.`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                return handleDelete(course);
            },
        });
    };

    // Xử lý xóa khóa học
    const handleDelete = async (course) => {
        try {
            const res = await DeleteSoftCourse(course._id);
            if (res) {
                message.success(`Đã chuyển khóa học "${course.name}" vào thùng rác`);
                await fetchCourses();
                return true;
            }
            return false;
        } catch (error) {
            message.error("Không thể xóa khóa học. Vui lòng thử lại sau.");
            return false;
        }
    };

    // Menu dropdown cho từng khóa học
    const getItems = (course) => [
        {
            key: '1',
            label: <Link to={`/course-detail/${course._id}`}>Xem chi tiết</Link>,
            icon: <EyeOutlined />,
        },
        {
            key: '2',
            label: <Link to={`/manager/edit/${course._id}`}>Chỉnh sửa</Link>,
            icon: <EditOutlined />,

        },
        {
            key: '3',
            label: 'Xóa khóa học',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => showDeleteConfirm(course)
        },
    ];

    // Tạo khóa học mẫu để hiển thị skeleton loading
    const skeletonItems = Array.from({ length: pagination.pageSize }, (_, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
            <Card
                hoverable
                className="course-card-skeleton"
                cover={<Skeleton.Image active style={{ width: '100%', height: 160 }} />}
            >
                <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
        </Col>
    ));

    const currentPageData = getCurrentPageData();

    return (
        <div className="courses-page">
            {/* Header Section */}
            <div className="courses-header">
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>Danh sách khóa học</Title>
                        <Text type="secondary">
                            Quản lý và theo dõi khóa học của bạn
                        </Text>
                    </Col>
                    <Col>
                        <Space>
                            <Link to="/manager/create">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                >
                                    Thêm khóa học
                                </Button>
                            </Link>
                            <Link to="/manager/trash">
                                <Button
                                    icon={<DeleteFilled />}
                                    size="large"
                                    className="trash-btn"
                                >
                                    Thùng rác
                                </Button>
                            </Link>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Filter Section */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={8}>
                    <Input
                        placeholder="Tìm kiếm khóa học..."
                        prefix={<SearchOutlined />}
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
                <Col xs={24} md={6}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Lọc theo giá"
                        onChange={(value) => setFilter(value)}
                        defaultValue="all"
                    >
                        <Option value="all">Tất cả khóa học</Option>
                        <Option value="free">Khóa học miễn phí</Option>
                        <Option value="paid">Khóa học trả phí</Option>
                    </Select>
                </Col>
            </Row>

            {/* Courses Grid */}
            <div className="courses-grid">
                {loading ? (
                    <Row gutter={[24, 24]}>
                        {skeletonItems}
                    </Row>
                ) : filteredCourses.length === 0 ? (
                    <Card className="empty-container">
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            styles={{ image: { height: 160 } }}
                            description={
                                searchText || filter !== 'all' ? (
                                    <Text>Không tìm thấy khóa học phù hợp</Text>
                                ) : (
                                    <Text>
                                        Bạn chưa đăng khóa học nào. <Link to="/manager/create">Đăng khóa học mới</Link>
                                    </Text>
                                )
                            }
                        >
                            {(searchText || filter !== 'all') && (
                                <Button type="primary" onClick={() => { setSearchText(''); setFilter('all'); }}>
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </Empty>
                    </Card>
                ) : (
                    <>
                        <Row gutter={[24, 24]}>
                            {currentPageData.map((course) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
                                    <Card
                                        hoverable
                                        className="course-card"
                                        cover={
                                            <div className="course-image-container">
                                                <img
                                                    alt={course.name}
                                                    src={course.course_img || `${import.meta.env.VITE_BACKEND_URL}/uploads/no-img.png`}
                                                    className="course-image"
                                                />
                                                {course.price === 0 && (
                                                    <Tag color="green" className="price-tag">Miễn phí</Tag>
                                                )}
                                                <div className="course-actions">
                                                    <Dropdown
                                                        menu={{ items: getItems(course) }}
                                                        placement="bottomRight"
                                                        trigger={['click']}
                                                        arrow
                                                    >
                                                        <Button type="primary" shape="circle" icon={<MoreOutlined />} />
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        }
                                        actions={[
                                            <Tooltip title="Chỉnh sửa">
                                                <Link to={`/manager/edit/${course._id}`}>
                                                    <EditOutlined key="edit" />
                                                </Link>
                                            </Tooltip>,
                                            <Tooltip title="Xem chi tiết">
                                                <Link to={`/course-detail/${course._id}`} >
                                                    <EyeOutlined key="view" />
                                                </Link>
                                            </Tooltip>,
                                            <Tooltip title="Xóa">
                                                <DeleteOutlined key="delete" onClick={() => showDeleteConfirm(course)} />
                                            </Tooltip>,
                                        ]}
                                    >
                                        <div className="course-content">
                                            <Title level={4} ellipsis={{ rows: 2 }} style={{ height: 48, marginBottom: 12 }}>
                                                {course.name || "Không có tiêu đề"}
                                            </Title>

                                            <div className="course-meta">
                                                <Space split={<Divider type="vertical" />}>
                                                    {course.students && (
                                                        <Text type="secondary">
                                                            <UserOutlined /> {course.students.length || 0}
                                                        </Text>
                                                    )}
                                                    {course.category && (
                                                        <Text type="secondary">
                                                            <BookOutlined /> {course.category}
                                                        </Text>
                                                    )}
                                                </Space>
                                            </div>

                                            <div className="course-price">
                                                <Text strong style={{ fontSize: 18, color: course.price > 0 ? '#f86d2d' : '#52c41a' }}>
                                                    <DollarOutlined /> {formatPrice(course.price)}
                                                </Text>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{
                            marginTop: 24,
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'end'
                        }}>
                            < Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={handleChangePage}
                                showSizeChanger
                                pageSizeOptions={['10', '15', '20', '30']}
                            />
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default Courses;
