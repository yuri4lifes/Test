import React, { useContext, useEffect, useState } from 'react';
import logo from "../../assets/logo/Edulicate1.png";
import { Menu, Button, Avatar, Dropdown, Typography, Layout, Space, Divider } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    HomeOutlined,
    ReadOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);

    const handleMenuClick = () => {
        setOpen(false);
    };

    useEffect(() => {
        setUser({
            name: auth?.user?.name ?? "",
            avatar: auth?.user?.avatar ?? "",
            email: auth?.user?.email ?? "",
            role: auth?.user?.role ?? ""
        })
    }, [auth]);

    const handleLogout = () => {
        setAuth({
            isAuthenticated: false,
            user: null
        });
        setUser({});
        localStorage.clear("token");
        navigate("/");
    };

    const userMenuContent = (
        <div style={styles.userMenuContainer}>
            <div style={styles.userMenuHeader}>
                <Avatar size={64} src={user?.avatar} icon={!user?.avatar && <UserOutlined />} style={styles.userMenuAvatar} />
                <div style={styles.userMenuInfo}>
                    <div style={styles.userName}>{auth?.user?.name || "Username"}</div>
                    <div style={styles.userEmail}>{user?.email || "example@gmail.com"}</div>
                    <div style={styles.userRole}>
                        {auth?.user?.role === "admin" ? "Quản trị viên" : auth?.user?.role === "teacher" ? "Giảng viên" : "Học viên"}
                    </div>
                </div>
            </div>
            <Divider style={styles.menuDivider} />
            <div style={styles.menuItem} onClick={handleMenuClick}>
                <UserOutlined style={styles.menuItemIcon} />
                <Link to="/profile" style={styles.menuItemLink}>Hồ sơ cá nhân</Link>
            </div>

            <Divider style={styles.menuDivider} />
            <div style={styles.menuItem} onClick={() => { handleLogout(); handleMenuClick(); }}>
                <LogoutOutlined style={styles.menuItemIcon} color="#ff4d4f" />
                <span style={styles.logoutText}>Đăng xuất</span>
            </div>
        </div>
    );

    const menuItems = [
        {
            label: (
                <Link to="/">
                    <Space key="home">
                        <HomeOutlined /> Trang chủ
                    </Space>
                </Link>
            ),
            key: '/',
        },
        {
            label: (
                <Link to="/course">
                    <Space key="course">
                        <ReadOutlined /> Khoá học
                    </Space>
                </Link>
            ),
            key: '/course',
        },
        ...(auth?.user?.role === "teacher" || auth?.user?.role === "admin" ? [
            {
                label: (
                    <Link to="/course-manager">
                        <Space key="course-manager">
                            <SettingOutlined />Quản lý khóa học
                        </Space>
                    </Link>
                ),
                key: '/course-manager',
            },
        ] : []), ...(auth?.user?.role === "admin" ? [
            {
                label: (
                    <Link to="/manager">
                        <Space key="manager">
                            <DashboardOutlined /> Trang quản trị
                        </Space>
                    </Link>
                ),
                key: '/manager',
            },
        ] : []),
    ];

    return (
        <>
            <style>
                {`
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item-selected,
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item:hover {
                    color: #1890ff;
                }
                
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item:after,
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item-selected:after,
                .custom-menu.ant-menu-light.ant-menu-horizontal > .ant-menu-item:hover:after {
                    border-bottom: none !important;
                }
            `}
            </style>
            <AntHeader style={styles.header}>
                <div style={styles.container}>
                    {/* Logo */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 0'
                    }}>
                        <Link to="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textDecoration: 'none',
                            color: 'inherit',
                            whiteSpace: 'nowrap' // Ngăn chữ xuống dòng
                        }}>
                            <img
                                src={logo}
                                alt="Logo EduOnline"
                                style={{
                                    height: '38px',
                                    objectFit: 'contain'
                                }}
                            />
                            <Title level={3} style={{
                                margin: 0,
                                fontWeight: 600,
                                color: '#4096ff',
                                whiteSpace: 'nowrap', // Ngăn chữ xuống dòng
                                fontSize: '18px' // Giảm kích thước chữ nếu cần thiết
                            }}>
                                EduOnline
                            </Title>
                        </Link>
                    </div>
                    {/* Navigation Menu - Đặt ở giữa */}
                    <div style={styles.menuContainer}>
                        <Menu
                            mode="horizontal"
                            items={menuItems}
                            selectedKeys={[location.pathname]}
                            style={styles.menu}
                            theme="light"
                            className="custom-menu"
                        />
                    </div>

                    <div style={styles.actionsContainer}>
                        <div style={styles.userContainer}>
                            {auth.isAuthenticated ? (
                                <Dropdown
                                    dropdownRender={() => userMenuContent}
                                    trigger={["click"]}
                                    placement="bottomRight"
                                    arrow
                                    onOpenChange={setOpen} open={open}
                                >
                                    <div style={styles.userAvatar}>
                                        <Avatar
                                            size="default"
                                            src={user?.avatar}
                                            icon={!user?.avatar && <UserOutlined />}
                                        />
                                    </div>
                                </Dropdown>
                            ) : (
                                <Space size="middle">
                                    <Button onClick={() => { navigate("/login", { state: { from: location.pathname }, replace: true }); }} type="default">Đăng nhập</Button>
                                    <Button type="primary" onClick={() => { navigate("/register", { state: { from: location.pathname }, replace: true }); }}>Đăng ký</Button>
                                </Space>
                            )}
                        </div>
                    </div>
                </div>
            </AntHeader>
        </>
    );
};

const styles = {
    header: {
        padding: 0,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: 'auto',
        lineHeight: 'normal',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        height: '64px',
    },
    logo: {
        flexShrink: 0,
        marginRight: '24px',
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    logoIcon: {
        fontSize: 28,
        color: '#1890ff',
        marginRight: 8,
    },
    logoText: {
        margin: 0,
        color: '#1890ff',
    },
    menuContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    menu: {
        borderBottom: 'none',
        backgroundColor: 'transparent',
        fontSize: 15,
        justifyContent: 'center',
        flex: 1,
        minWidth: 0
    },
    actionsContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginLeft: '24px',
    },
    search: {
        width: 180,
    },
    userContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    userAvatar: {
        cursor: 'pointer',
    },
    avatar: {
        background: '#1890ff',
        cursor: 'pointer',
    },
    // Styles cho menu người dùng
    userMenuContainer: {
        width: 280,
        background: 'white',
        borderRadius: 4,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        padding: '8px 0',
    },
    userMenuHeader: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    userMenuAvatar: {
        marginBottom: 8,
        background: '#ccc',
    },
    userMenuInfo: {
        width: '100%',
        textAlign: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    userRole: {
        fontSize: 12,
        color: '#fff',
        background: '#f56a00',
        borderRadius: 12,
        padding: '2px 12px',
        display: 'inline-block',
    },
    menuDivider: {
        margin: '4px 0',
    },
    menuItem: {
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background 0.3s',
        '&:hover': {
            background: '#f5f5f5',
        },
    },
    menuItemIcon: {
        marginRight: 10,
        fontSize: 16,
        color: '#666',
    },
    menuItemLink: {
        color: '#000',
        textDecoration: 'none',
    },
    logoutText: {
        color: '#ff4d4f',
    },
};

export default Header;