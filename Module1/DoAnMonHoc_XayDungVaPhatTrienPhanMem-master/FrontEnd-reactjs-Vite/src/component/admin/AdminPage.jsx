import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Footer from "../layout/footer";
import ScrollToTop from "../ScrollToTop";

const AdminPage = () => {
    return (
        <>
            <ScrollToTop />
            <AdminHeader />
            <Outlet />
            <Footer />
        </>
    )
};

export default AdminPage;
