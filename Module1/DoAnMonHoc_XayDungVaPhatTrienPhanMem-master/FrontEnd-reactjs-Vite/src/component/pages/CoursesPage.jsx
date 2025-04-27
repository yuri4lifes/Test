import React, { useContext, useEffect, useState } from "react";
import {
    Card,
    Col,
    Row,
    Typography,
    Tag,
    Input,
    Select,
    Divider,
    Pagination,
    Empty,
    Skeleton,
    Space,
    Spin
} from "antd";
import {
    UserOutlined,
    ReadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { GetCourseList } from "../../ultill/courseApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { GetInforUser } from "../../ultill/userApi";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;



const CoursesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [coursesData, setCoursesData] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const data = await GetCourseList();
                if (Array.isArray(data)) {
                    setCoursesData(data);
                } else {
                    setCoursesData([]);
                }
            } catch (error) {
                setCoursesData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);
    const pageSize = 8;

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

    const onHandleEnroll = async (_id) => {
        try {
            if (auth?.user?.role) {
                const res = await GetInforUser(auth?.user?.id);
                const newListEnroll = res?.enrolledCourses ?? [];
                newListEnroll.includes(_id) ? navigate(`/course-learning/${_id}`) : navigate(`/course-detail/${_id}`);
            }
            else {
                navigate(`/course-detail/${_id}`)
            }
        } catch (error) {
        }
    }

    const CourseCard = ({ course }) => (
        <Card
            hoverable
            style={{
                borderRadius: "12px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease",
                overflow: "hidden",
                position: "relative"
            }}
        >
            <img
                onClick={() => onHandleEnroll(course._id)}
                src={course.course_img || `${import.meta.env.VITE_BACKEND_URL}/uploads/no-img.png`}
                alt={course.name}
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
            />
            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: "12px", flex: 1 }}>
                <Typography.Text>
                    <strong>{course.name}</strong>
                </Typography.Text>
            </Paragraph>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Tag color={course.price === 0 ? "green" : "orange"}>
                    {course.price === 0 ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(course.price)}
                </Tag>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text>
                        <UserOutlined style={{ marginRight: "4px" }} />
                        {course.students?.length ? course.students.length.toLocaleString() : "0"}
                    </Text>
                    <Text>
                        <ReadOutlined style={{ marginRight: "4px" }} />
                        {course.lessons?.length ? course.lessons.length : "0"} bài học
                    </Text>
                </div>
            </Space>
        </Card>
    );

    // Filter courses
    const filteredCourses = coursesData.filter(course => {
        const matchesSearch = (course.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (course.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesPrice = priceFilter === "all" ||
            (priceFilter === "free" && course.price === 0) ||
            (priceFilter === "paid" && course.price > 0);

        return matchesSearch && matchesPrice;
    });

    // Pagination
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSearch = value => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handlePriceChange = value => {
        setPriceFilter(value);
        setCurrentPage(1);
    };

    const handlePageChange = page => {
        setLoading(true);
        setTimeout(() => {
            setCurrentPage(page);
            setLoading(false);
        }, 300);
    };

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <Title level={2}>Khóa học</Title>
            <Text type="secondary">Khám phá các khóa học chất lượng cao để nâng cao kỹ năng của bạn</Text>

            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={18}>
                    <Search placeholder="Tìm kiếm khóa học..." allowClear enterButton={<SearchOutlined />} size="large" onSearch={handleSearch} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </Col>
                <Col xs={24} sm={6}>
                    <Select style={{ width: "100%" }} placeholder="Giá" value={priceFilter} onChange={handlePriceChange} size="large">
                        <Option value="all">Tất cả</Option>
                        <Option value="free">Miễn phí</Option>
                        <Option value="paid">Trả phí</Option>
                    </Select>
                </Col>
            </Row>

            <Divider />

            {loading ? (
                <Row gutter={[16, 16]}>
                    {Array(4).fill(null).map((_, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <Card style={{ width: "100%", borderRadius: "12px" }}>
                                <Skeleton active avatar paragraph={{ rows: 4 }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : filteredCourses.length > 0 ? (
                <>
                    <Row gutter={[16, 16]}>
                        {paginatedCourses.map(course => (
                            <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
                                <CourseCard course={course} />
                            </Col>
                        ))}
                    </Row>
                    {filteredCourses.length > pageSize && (
                        <Pagination
                            current={currentPage}
                            total={filteredCourses.length}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    )}
                </>
            ) : <Empty description="Không tìm thấy khóa học nào" />}
        </div>
    );
};

export default CoursesPage;
