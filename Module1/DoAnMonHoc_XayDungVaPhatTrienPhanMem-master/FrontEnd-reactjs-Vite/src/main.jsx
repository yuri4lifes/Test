import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/course.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './component/pages/LoginPage.jsx'
import HomePage from './component/pages/HomePage.jsx'
import CoursesPage from './component/pages/CoursesPage.jsx'
import RegisterPage from './component/pages/Register.jsx'
import { AuthWrapper } from './component/context/auth.context.jsx'
import AdminPage from './component/admin/AdminPage.jsx'
import User from './component/admin/User.jsx'
import Courses from './component/admin/Courses.jsx'
import CreateCourse from './component/admin/CreateCourse.jsx'
import CourseEdit from './component/admin/CourseEdit.jsx';
import TrashCourse from './component/admin/TrashCourse.jsx';
import PrivateRoute from './component/routes/PrivateRoute.jsx'
import AdminHomePage from './component/admin/AdminHomePage.jsx';
import CreateUser from './component/admin/CreateUser.jsx';
import Profile from './component/pages/Profile.jsx';
import CourseMangerPageTeacher from './component/pages/CourseMangerPageTeacher.jsx';
import CourseDetail from './component/pages/CourseDetail.jsx';
import CourseLearning from './component/pages/CourseLearning.jsx';
import { message } from 'antd';
import PaymentSuccessPage from './component/pages/Payment-success.jsx';
import PaymentFailedPage from './component/pages/Payment-failed.jsx';

// Cấu hình global cho tất cả các thông báo trên trang web
message.config({
  top: 60,       // Khoảng cách từ mép trên xuống (có thể chỉnh)
  duration: 3,   // Thời gian hiển thị mỗi thông báo (giây)
  maxCount: 3,   // Giới hạn số lượng thông báo hiển thị cùng lúc
});


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "register",
          element: <RegisterPage />
        },
        {
          path: "login",
          element: <LoginPage />
        },
        {
          path: "course",
          element: <CoursesPage />
        },
        {
          path: "course-detail/:id",
          element: <CourseDetail />
        },
        {
          path: "course-learning/:id",
          element: <CourseLearning />
        },
        {
          path: "profile",
          element: <PrivateRoute element={<Profile />} role={["admin", "teacher", "user"]} />
        },
        {
          path: "course-manager",
          element: <PrivateRoute element={<CourseMangerPageTeacher />} role={["admin", "teacher"]} />
        },
        {
          path: "course-create",
          element: <PrivateRoute element={<CreateCourse />} role={["admin", "teacher"]} />
        },
        {
          path: "course-edit/:id",
          element: <PrivateRoute element={<CourseEdit />} role={["admin", "teacher"]} />
        },
      ]
    },
    {
      path: "/payment-success/:id",
      element: <PaymentSuccessPage />
    },
    {
      path: "/payment-failed/:id",
      element: <PaymentFailedPage />
    },
    {
      path: "/manager",
      element: <PrivateRoute element={<AdminPage />} role={["admin", "teacher"]} />,
      children: [
        {
          path: "",
          element: <AdminHomePage />
        },
        {
          path: "user",
          element: <User />
        },
        {
          path: "course",
          element: <Courses />
        },
        {
          path: "create",
          element: <CreateCourse />
        },
        {
          path: "edit/:id",
          element: <CourseEdit />
        },
        {
          path: "trash",
          element: <TrashCourse />
        },
        {
          path: "user-create",
          element: <CreateUser />
        },
        {
          path: "profile",
          element: <PrivateRoute element={<Profile />} role={["admin", "teacher", "user"]} />
        },
      ],
    }
  ]
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
