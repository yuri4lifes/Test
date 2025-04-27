import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import axios from './ultill/axios.custom';
import { Spin } from "antd";
import { AuthContext } from './component/context/auth.context';
import Header from './component/layout/header'
import Footer from './component/layout/footer'
import ScrollToTop from './component/ScrollToTop';

function App() {
  const { loading, setLoading, setAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      try {
        const URL_API = "/v1/api/getaccount";
        const res = await axios.get(URL_API);

        if (res && res.data && !res.data.EC) {
          const userData = res.data.user || res.data || res;

          setAuth({
            isAuthenticated: true,
            user: {
              id: userData._id || userData.id || "",
              email: userData.email || "",
              name: userData.name || "",
              avatar: userData.avatar || "",
              role: userData.role || "",
            }
          });
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, [])

  return (
    <div>
      {loading === true ? (
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
      ) : (
        <>
          <ScrollToTop />
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  )
}

export default App