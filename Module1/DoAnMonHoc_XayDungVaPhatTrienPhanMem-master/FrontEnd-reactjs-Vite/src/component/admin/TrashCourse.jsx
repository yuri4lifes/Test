import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Typography, Empty, Card, Tooltip, Popconfirm, Spin } from 'antd';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { DestroyCourse, GetCourseListDelete, restoreCourse } from '../../ultill/courseApi';
import moment from 'moment';

const { Text } = Typography;

const TrashCourse = () => {
    const [trashedCourses, setTrashedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchCoursesDelete = async () => {
        try {
            setLoading(true);
            const res = await GetCourseListDelete();
            if (Array.isArray(res)) {
                const formattedData = res.map(course => ({
                    id: course._id,
                    title: course.name,
                    teacher: course?.teacher_id?.name || "Chưa có thông tin",
                    deletedAt: course.deletedAt || new Date().toISOString(),
                }));

                setTrashedCourses(formattedData);
                setPagination(prev => ({
                    ...prev,
                    total: formattedData.length,
                }));
            } else {
            }
            setLoading(false);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchCoursesDelete();
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

    // Hàm xử lý khôi phục khóa học
    const handleRestore = (record) => {
        try {
            const res = restoreCourse(record.id);
            if (res) {
                message.success(`Đã khôi phục khóa học: ${record.title}`);
                setTrashedCourses(trashedCourses.filter(course => course.id !== record.id));
            }
        }
        catch (error) {
            message.error(`Khôi phục khóa học không thành công!`);
        }
    };

    // Hàm xử lý xóa vĩnh viễn
    const handleDestroyCourse = (record) => {
        try {
            const res = DestroyCourse(record.id);
            if (res) {
                message.success(`Đã xóa vĩnh viễn khóa học: ${record.title}`);
                setTrashedCourses(trashedCourses.filter(course => course.id !== record.id));
            }
        }
        catch (error) {
            message.error(`Xóa khóa học không thành công!`);
        }
    };

    // Hàm xử lý thay đổi pagination
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    // Cấu hình các cột trong bảng
    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Giảng viên',
            dataIndex: 'teacher',
            key: 'teacher',
        },
        {
            title: 'Ngày xóa',
            dataIndex: 'deletedAt',
            key: 'deletedAt',
            render: (text) => moment(text).format("DD/MM/YYYY"),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 160,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Khôi phục">
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => handleRestore(record)}
                        ><UndoOutlined /></Button>
                    </Tooltip>
                    <Tooltip title="Xóa vĩnh viễn">
                        <Popconfirm
                            title="Xóa vĩnh viễn khóa học ?"
                            description="Khóa học sẽ không thể khôi phục!"
                            onConfirm={() => handleDestroyCourse(record)}
                            okText="Xóa vĩnh viễn"
                            cancelText="Hủy"
                        >
                            <Button danger><DeleteOutlined /></Button>
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card className="trash-course-container">
            <Table
                columns={columns}
                dataSource={trashedCourses}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                locale={{
                    emptyText: <Empty description="Không có khóa học nào trong thùng rác" />
                }}
            />
        </Card>
    );
};

export default TrashCourse;