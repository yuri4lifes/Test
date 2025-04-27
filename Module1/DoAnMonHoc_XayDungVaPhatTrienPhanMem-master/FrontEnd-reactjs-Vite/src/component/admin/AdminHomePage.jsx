import React, { useEffect, useState } from "react";
import {
    Typography,
    Card,
    Statistic,
    Table,
    Button,
    Row,
    Col,
    Space,
    Avatar,
    Divider,
    Spin,
} from "antd";
import {
    BookOutlined,
    TeamOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetCourseList } from "../../ultill/courseApi";
import { GetListUser } from "../../ultill/userApi";
import moment from "moment";
import { GetActivitie } from "../../ultill/acctivitieApi";

const { Title, Text } = Typography;

const AdminHomePage = () => {

    const [statisticsData, setStatisticsData] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [courseEnrollmentData, setCourseEnrollmentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fectchStatisticsData = async () => {
            try {
                setLoading(true);
                const course = await GetCourseList();
                const user = await GetListUser();
                const res = await GetActivitie();
                await setActivities(res);

                const userList = user.filter(item => item.role === "user");
                const roleTeacher = user.filter(item => item.role === "teacher");
                setRecentUsers(userList);
                setCourseEnrollmentData(course);

                const students = course.reduce((total, course) => total + course.students.length, 0);
                const courses = course.length;
                const lessons = course.reduce((total, course) => total + course.lessons.length, 0);

                setStatisticsData([
                    { title: "Tổng Học Viên", value: students || 0, icon: <TeamOutlined />, color: "#1890ff" },
                    { title: "Tổng Khóa Học", value: courses || 0, icon: <BookOutlined />, color: "#52c41a" },
                    { title: "Bài Giảng", value: lessons || 0, icon: <VideoCameraOutlined />, color: "#faad14" },
                    { title: "Giảng viên", value: roleTeacher?.length || 0, icon: <UserOutlined />, color: "#f15bb5" },
                ]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        fectchStatisticsData();
    }, []);

    const userColumns = [
        {
            title: "Người dùng",
            dataIndex: "name",
            key: "_id",
            render: (text, record) => (
                <Space>
                    <Avatar src={record?.avatar} icon={!record?.avatar && <UserOutlined />} />

                    <div>
                        <Text strong>{text}</Text>
                        <div>
                            <Text type="secondary">{record.email}</Text>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Ngày tham gia",
            dataIndex: "createdAt",
            key: "date",
            render: (text) => moment(text).format('DD/MM/YYYY HH:mm')
        },
    ];

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

    return (
        <div className="admin-dashboard-container" style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Page Title */}
            <div style={{ marginBottom: "24px" }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3}>Dashboard</Title>
                        <Text type="secondary">Chào mừng trở lại, Admin</Text>
                    </Col>
                </Row>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                {statisticsData.map((stat, index) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={index}>
                        <Card>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                valueStyle={{ color: stat.color }}
                                prefix={stat.icon}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Divider />

            {/* Recent Users and Course Enrollment */}
            <Row gutter={[24, 24]}>
                {/* Recent Users */}
                <Col xs={24} lg={16}>
                    <Card
                        title="Người Dùng Mới"
                        style={{ marginBottom: "24px" }}
                    >
                        <Table
                            dataSource={recentUsers}
                            columns={userColumns}
                            pagination={false}
                            rowKey={(record) => record._id || record.index}
                        />
                    </Card>
                </Col>

                {/* Course Enrollment */}
                <Col xs={24} lg={8}>
                    <Card
                        title="Tình Trạng Khóa Học"
                    >
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            {courseEnrollmentData.map((course) => (
                                <div key={course._id}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <Text ellipsis style={{ maxWidth: "70%" }} title={course.name}>
                                            {course.name}
                                        </Text>
                                        <Text type="secondary">{course?.students?.length || 0} học viên</Text>
                                    </div>
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activity */}
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card title="Hoạt Động Gần Đây">
                        <Timeline>
                            {activities.map((activity) => (
                                <Timeline.Item
                                    key={activity._id}
                                    color={
                                        activity.type === 'register_account' ? 'green' :
                                            activity.type === 'register_course' ? '#3a86ff' :
                                                activity.type === 'add_course' ? 'orange' : 'orange'
                                    }
                                >
                                    {/* Tùy thuộc vào loại hoạt động, hiển thị thông tin tương ứng */}
                                    {activity.type === 'register_account' && (
                                        <Text>
                                            <Text style={{ color: '#023047', fontWeight: 'bold' }}>{activity.userName} </Text>
                                            {' '} -{' '}
                                            <Text style={{ color: 'green' }}>đăng ký tài khoản</Text>
                                            {' '} -{' '}
                                            <Text style={{ color: '#8c8c8c' }}> {moment(activity.createdAt).format('DD/MM/YYYY')} </Text>
                                        </Text>
                                    )}
                                    {activity.type === 'register_course' && (
                                        <Text>
                                            <Text style={{ color: '#023047', fontWeight: 'bold' }}>{activity.userName}</Text>
                                            {' '} -{' '}
                                            <Text style={{ color: '#3a86ff' }}>đăng ký khóa học</Text>
                                            {' '} -{' '}
                                            <Text style={{ color: '#d62828' }}>{activity.courseName}</Text>
                                            {' '} -{' '}
                                            <Text style={{ color: '#8c8c8c' }}> {moment(activity.createdAt).format('DD/MM/YYYY')} </Text>
                                        </Text>
                                    )}
                                    {activity.type === 'add_course' && (
                                        <Text>
                                            <Text style={{ color: '#023047', fontWeight: 'bold' }}>{activity.userName} </Text>
                                            {' '} -{' '}
                                            <Text style={{ color: 'orange' }}>thêm khóa học mới</Text>
                                            {' '} -{' '}
                                            <Text style={{ color: '#d62828' }}>{activity.courseName}</Text>
                                            {' '} -{' '}
                                            <Text style={{ color: '#8c8c8c' }}> {moment(activity.createdAt).format('DD/MM/YYYY')} </Text>
                                        </Text>
                                    )}
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Define Timeline component
const Timeline = ({ children }) => <div className="ant-timeline" style={{ padding: "8px 0" }}>{children}</div>;
Timeline.Item = ({ color, children }) => (
    <div className="ant-timeline-item" style={{ margin: "0 0 20px 0", position: "relative", paddingLeft: "20px" }}>
        <div className="ant-timeline-item-tail" style={{ position: "absolute", left: "5px", top: "10px", height: "calc(100% + 10px)", borderLeft: "2px solid #f0f0f0" }}></div>
        <div className="ant-timeline-item-head" style={{ position: "absolute", left: "0", top: "5px", width: "10px", height: "10px", backgroundColor: color, borderRadius: "50%" }}></div>
        <div className="ant-timeline-item-content">{children}</div>
    </div>
);

export default AdminHomePage;