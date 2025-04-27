import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
    return (
        <AntFooter style={{ background: '#001529', padding: '40px 0' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
                {/* Main Footer Content */}
                <Row gutter={[32, 32]}>
                    {/* Logo and Description */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Title level={3} style={{ color: '#fff', marginBottom: '16px' }}>EduOnline</Title>
                        <Text style={{ color: '#aaa', display: 'block', marginBottom: '24px' }}>
                            Empowering learners worldwide with high-quality online education.
                        </Text>
                        <Space size="large">
                            <Link target="_blank" style={{ color: '#1890ff' }}>
                                <FacebookOutlined style={{ fontSize: '24px' }} />
                            </Link>
                            <Link target="_blank" style={{ color: '#1890ff' }}>
                                <TwitterOutlined style={{ fontSize: '24px' }} />
                            </Link>
                            <Link target="_blank" style={{ color: '#1890ff' }}>
                                <InstagramOutlined style={{ fontSize: '24px' }} />
                            </Link>
                            <Link target="_blank" style={{ color: '#1890ff' }}>
                                <YoutubeOutlined style={{ fontSize: '24px' }} />
                            </Link>
                        </Space>
                    </Col>

                    {/* Courses */}
                    <Col xs={24} sm={8} md={5} lg={5}>
                        <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>Courses</Title>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Web Development</Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Mobile Development</Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Data Science</Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Design</Link>
                            </li>
                            <li>
                                <Link style={{ color: '#aaa' }} >All Courses</Link>
                            </li>
                        </ul>
                    </Col >

                    {/* Company */}
                    < Col xs={24} sm={8} md={5} lg={5} >
                        <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>Company</Title>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >About Us</Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Careers</Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Blog</Link>
                            </li>
                            <li>
                                <Link style={{ color: '#aaa' }} >Contact Us</Link>
                            </li>
                        </ul>
                    </Col >

                    {/* Legal */}
                    < Col xs={24} sm={8} md={5} lg={5} >
                        <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>Legal</Title>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Terms of Service</Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link style={{ color: '#aaa' }} >Privacy Policy</Link>
                            </li>
                            <li>
                                <Link style={{ color: '#aaa' }} >Cookie Policy</Link>
                            </li>
                        </ul>
                    </Col >
                </Row >

                {/* Copyright */}
                < Row >
                    <Col span={24}>
                        <div style={{ borderTop: '1px solid #333', marginTop: '32px', paddingTop: '24px', textAlign: 'center' }}>
                            <Text style={{ color: '#aaa' }}>© 2025 EduOnline. All rights reserved.</Text>
                        </div>
                    </Col>
                </Row >
            </div >
        </AntFooter >
    );
};

export default Footer;