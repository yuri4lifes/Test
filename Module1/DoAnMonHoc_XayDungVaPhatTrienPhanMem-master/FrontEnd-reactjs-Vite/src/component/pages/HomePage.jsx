import React, { useEffect, useState } from "react";
import {
    Carousel,
    Button,
    Typography,
    Row,
    Col,
    Card,
    Space,
    Spin,
} from "antd";
import {
    LeftOutlined,
    RightOutlined,
    BookOutlined,
    TrophyOutlined,
    TeamOutlined,
    ArrowRightOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { GetCourseList } from "../../ultill/courseApi";

const { Title, Paragraph } = Typography;
const { Meta } = Card;


const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const [featuredCourses, setFeaturedCourses] = useState([]);

    const carouselData = [
        {
            title: "Khóa Học Chất Lượng",
            description: "Học theo lộ trình rõ ràng, bài bản từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu.",
            imageUrl: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_01_2.png"
        },
        {
            title: "Khóa Học Chất Lượng",
            description: "Học theo lộ trình rõ ràng, bài bản từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu.",
            imageUrl: "https://files.fullstack.edu.vn/f8-prod/banners/Banner_03_youtube.png"
        },
    ];

    const fectFeaturedCourses = async () => {
        try {
            setLoading(true);
            const courses = await GetCourseList();
            const topCourse = courses
                .sort((a, b) => b.students.length - a.students.length) // Sắp xếp giảm dần theo số students
                .slice(0, 3);
            setFeaturedCourses(topCourse);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        fectFeaturedCourses();
    }, [])

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

    // Custom carousel arrows
    const NextArrow = (props) => (
        <div className="custom-arrow next" onClick={props.onClick}>
            <RightOutlined />
        </div>
    );

    const PrevArrow = (props) => (
        <div className="custom-arrow prev" onClick={props.onClick}>
            <LeftOutlined />
        </div>
    );

    return (
        <div className="homepage-container">
            <Carousel
                arrows
                prevArrow={<PrevArrow />}
                nextArrow={<NextArrow />}
                autoplay
                className="main-carousel"
            >
                {carouselData.map((slide, index) => (
                    <div key={index} className="carousel-slide">
                        <div className="slide-content-wrapper">
                            <Row gutter={[32, 32]} align="middle" className="slide-row">
                                <Col xs={24} md={12} className="slide-content">
                                    <Title level={2}>{slide.title}</Title>
                                    <Paragraph>{slide.description}</Paragraph>
                                </Col>
                                <Col xs={24} md={12} className="slide-image">
                                    <img src={slide.imageUrl} alt={slide.title} />
                                </Col>
                            </Row>
                        </div>
                    </div>
                ))}
            </Carousel>

            <div className="section featured-courses">
                <div className="section-header">
                    <Title level={2} className="section-title">Khóa Học Nổi Bật</Title>
                    <Paragraph className="section-description">
                        Khám phá các khóa học phổ biến nhất của chúng tôi và bắt đầu học hỏi ngay hôm nay
                    </Paragraph>
                </div>

                <Row gutter={[24, 24]} className="courses-row">
                    {featuredCourses.map(course => (

                        <Col xs={24} sm={12} md={8} key={course._id}>
                            <Card
                                hoverable
                                cover={
                                    <div
                                        style={{
                                            height: '250px', // Chiều cao cố định
                                            overflow: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Link to={`/course-detail/${course._id}`}>
                                            <img
                                                alt={course.name}
                                                src={course.course_img || `${import.meta.env.VITE_BACKEND_URL}/uploads/no-img.png`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover' // Đảm bảo ảnh fill đầy không bị méo
                                                }}
                                            />
                                        </Link>
                                    </div>
                                }
                                className="course-card"
                            >
                                <Meta
                                    title={course.name}
                                    description={course.description || <EllipsisOutlined />}
                                />
                                <div className="course-details">
                                    <div className="course-stats">
                                        <span>{course?.lessons?.length || 0} Bài học</span>
                                        <span>{course?.students?.length || 0} Học viên</span>
                                    </div>
                                    <div className="course-price">{course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()} VNĐ`}</div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="view-all-courses">
                    <Link to={"/course"}>
                        <Button type="default" size="large">
                            Xem Tất Cả Khóa Học <ArrowRightOutlined />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="section why-choose-us">
                <div className="section-header">
                    <Title level={2} className="section-title">Tại Sao Chọn Chúng Tôi</Title>
                    <Paragraph className="section-description">
                        Chúng tôi cung cấp giáo dục chất lượng cao để giúp bạn mua mục tiêu của mình
                    </Paragraph>
                </div>

                <Row gutter={[24, 24]} className="features-row">
                    <Col xs={24} md={8}>
                        <Card className="feature-card">
                            <Space direction="vertical" size="middle" align="center">
                                <BookOutlined className="feature-icon" />
                                <Title level={4}>Giảng Viên Chuyên Nghiệp</Title>
                                <Paragraph>
                                    Học hỏi từ các chuyên gia trong ngành với nhiều năm kinh nghiệm trong lĩnh vực của họ.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card className="feature-card">
                            <Space direction="vertical" size="middle" align="center">
                                <TrophyOutlined className="feature-icon" />
                                <Title level={4}>Dự Án Thực Tế</Title>
                                <Paragraph>
                                    Áp dụng kiến ​​thức của bạn với các dự án thực hành xây dựng danh mục đầu tư của bạn.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card className="feature-card">
                            <Space direction="vertical" size="middle" align="center">
                                <TeamOutlined className="feature-icon" />
                                <Title level={4}>Cộng Đồng Hỗ Trợ</Title>
                                <Paragraph>
                                    Tham gia có một cộng đồng người học và nhận trợ giúp khi bạn cần.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* CSS styles for the component */}
            <style jsx="true">{`
        .homepage-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }
        
        .main-carousel {
          margin-bottom: 60px;
        }
        
        .carousel-slide {
          height: 500px;
          position: relative;
        }
        
        .slide-content-wrapper {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 50px;
        }
        
        .slide-content {
          max-width: 500px;
        }
        
        .slide-image img {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
        }
        
        .custom-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .custom-arrow.prev {
          left: 20px;
        }
        
        .custom-arrow.next {
          right: 20px;
        }
        
        .section {
          margin-bottom: 80px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .section-title {
          margin-bottom: 16px !important;
        }
        
        .section-description {
          max-width: 700px;
          margin: 0 auto !important;
        }
        
        .course-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .course-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }
        
        .course-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .course-stats {
          display: flex;
          justify-content: space-between;
          color: #888;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .course-price {
          font-weight: bold;
          font-size: 18px;
          color: orange;
        }
        
        .view-all-courses {
          text-align: center;
          margin-top: 30px;
        }
        
        .feature-card {
          height: 100%;
          text-align: center;
          padding: 24px;
        }
        
        .feature-icon {
          font-size: 40px;
          color: #1890ff;
        }
      `}</style>
        </div>
    );
};

export default HomePage;
