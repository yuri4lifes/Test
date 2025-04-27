import React, { useState, useEffect, useContext } from 'react';
import {
    Card,
    Table,
    Space,
    Button,
    Tag,
    Tooltip,
    Popconfirm,
    Typography,
    Statistic,
    message,
    Spin
} from 'antd';
import {
    DeleteOutlined,
    BookOutlined,
    TeamOutlined,
    EditOutlined,
    UndoOutlined,
    PlusOutlined,
    DeleteFilled
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { DeleteSoftCourse, DestroyCourse, GetCourseListByTeacherId, restoreCourse } from '../../ultill/courseApi';
import { AuthContext } from '../context/auth.context';

const { Title, Text } = Typography;

const CourseManagerPageTeacher = () => {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);


    // Mock data simulation
    useEffect(() => {
        fetchListCourse();
    }, []);

    const fetchListCourse = async () => {
        try {
            setLoading(true);
            const res = await GetCourseListByTeacherId(auth?.user?.id);
            setCourses(res);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

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

    const handleDelete = async (course_id) => {
        try {
            const res = await DeleteSoftCourse(course_id);
            if (res && res?.modifiedCount > 0) {
                message.success('Khóa học đã được đưa vào thùng rác.');
                setCourses(prevCourses =>
                    prevCourses.map(course =>
                        course._id === course_id ? { ...course, deleted: true } : course
                    )
                );
            }
        } catch (error) {

        }
    };

    const handleDestroy = async (course_id) => {
        try {
            const res = await DestroyCourse(course_id);
            if (res && res?.deletedCount > 0) {
                message.success('Khóa học đã bị xóa.');
                setCourses(prevCourses => prevCourses.filter(course => course._id !== course_id));
            }
        } catch (error) {
            message.error('Khóa học chưa được xóa.');
        }
    };

    const handleActivate = async (course_id) => {
        try {
            const res = await restoreCourse(course_id);
            if (res && res?.modifiedCount > 0) {
                message.success('Đã kích hoạt lại khóa học.');
                setCourses(prevCourses =>
                    prevCourses.map(course =>
                        course._id === course_id ? { ...course, deleted: false } : course
                    )
                );
            }
        } catch (error) {
            message.success('Kích hoạt lại khóa học không thành công!');
        }
    };

    const showCourseDetails = (course) => {
        setCurrentCourse(course);
    };


    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            key: 'title',
            render: (text, record) => (
                <a onClick={() => showCourseDetails(record)}>{text}</a>
            ),
        },
        {
            title: 'Số bài học',
            dataIndex: 'lessons',
            key: 'duration',
            render: (lessons) => lessons.length
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (record) => {
                return (
                    <span>
                        {record !== 0 ? (
                            <Text strong>{record.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
                        ) : (
                            <Text type="success">Miễn phí</Text>
                        )}
                    </span>
                );
            }
        },
        {
            title: 'Học viên',
            dataIndex: 'students',
            key: 'students',
            render: (students) => students.length
        },
        {
            title: 'Trạng thái',
            dataIndex: 'deleted',
            key: 'deleted',
            render: deleted => (
                <Tag color={deleted !== true ? 'green' : 'red'}>
                    {deleted !== true ? 'Hoạt động' : 'Đã xóa'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    {record.deleted !== true && (
                        <>
                            <Tooltip title="Chỉnh sửa">
                                <Link to={`/course-edit/${record._id}`}>
                                    <Button size="small">
                                        <EditOutlined />
                                    </Button>
                                </Link>
                            </Tooltip>
                            <Tooltip title="Xóa khóa học">
                                <Popconfirm
                                    title="Xóa khóa học?"
                                    description="Chuyển khóa học vào thùng rác!"
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    onConfirm={() => handleDelete(record._id)}
                                >
                                    <Button danger size="small">
                                        <DeleteOutlined />
                                    </Button>
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                    {record.deleted === true && (
                        <>
                            <Tooltip title="Khôi phục">
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => handleActivate(record._id)}
                                >
                                    <UndoOutlined />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Xóa vĩnh viễn">
                                <Popconfirm
                                    title="Xóa vĩnh viễn khóa học?"
                                    description="Xóa vĩnh viễn sẽ không thể khôi phục lại khóa học!"
                                    okText="Xóa vĩnh viễn"
                                    cancelText="Hủy"
                                    onConfirm={() => handleDestroy(record._id)}
                                >
                                    <Button danger size="small">
                                        <DeleteFilled />
                                    </Button>
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{
                padding: 24,
                background: '#fff',
                borderRadius: 4,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={4}>Quản lý khóa học</Title>
                    <Link to={"/course-create"}>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Thêm khóa học
                        </Button>
                    </Link>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Statistic title="Tổng số khóa học" value={courses.length} prefix={<BookOutlined />} />
                            <Statistic
                                title="Khóa học đang hoạt động"
                                value={courses ? courses.filter(course => !course.deleted).length : 0}
                                valueStyle={{ color: '#3f8600' }}
                            />
                            <Statistic
                                title="Tổng học viên đăng ký"
                                value={courses ? courses.reduce((sum, course) => sum + (course.students?.length || 0), 0) : 0}
                                prefix={<TeamOutlined />}
                            />
                        </div>
                    </Card>
                </div>

                <Table
                    columns={columns}
                    dataSource={courses}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </div>
    );
};

export default CourseManagerPageTeacher;
