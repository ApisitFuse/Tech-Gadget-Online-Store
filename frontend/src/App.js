import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './login/Register';
import Login from './login/Login';
import Profile from './user/Profile';
import Home from './general/Home';
import Navigation from './layout/Navigation';
import Unauthorized from './error/Unauthorized';
import SuperAdmin from './super_admin/SuperAdmin';
import Admin from './admin/Admin';
import Seller from './seller/Seller';
import { fetchCheckAuthAPI } from './services/authenticationService';
import "./tailwind.css";

// สร้าง PrivateRoute component เพื่อป้องกันการเข้าถึงเส้นทาง
const PrivateRoute = ({ element: Component, allowedRoles, userRole }) => {
  return allowedRoles.includes(userRole) ? (
    Component
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [authStatus, setAuthStatus] = useState(null);
  // const navigate = useNavigate();


  // ตรวจสอบการ login ทุกครั้งที่ component นี้ render
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchCheckAuthAPI();

        if (response.status === 403) {
          console.log("Access token expired, attempting to refresh...");
          setAuthStatus(response.status);
        } else {
          const data = await response.json();
          setUserRole(data.user.role);
          if (data.isLoggedIn) {
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, [isLoggedIn]); // ลบ isLoggedIn และ authStatus ออกจาก dependencies

  // การนำทางถ้า authStatus เป็น 403
  useEffect(() => {
    if (authStatus === 403) {
      console.log("authStatus", authStatus);
      // navigate('/login'); // ใช้ navigate ที่นี่
      // window.location.href = '/login';
    }
  }, [authStatus]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<Profile />} />

          {/* ตัวอย่างการใช้ PrivateRoute กับหน้า Super Admin */}
          <Route
            path="/super_admin"
            element={<PrivateRoute allowedRoles={['Super Admin']} userRole={userRole} element={<SuperAdmin />} />}
          />
          <Route
            path="/admin"
            element={<PrivateRoute allowedRoles={['Admin']} userRole={userRole} element={<Admin />} />}
          />
          <Route
            path="/seller"
            element={<PrivateRoute allowedRoles={['Seller']} userRole={userRole} element={<Seller />} />}
          />

          {/* หน้า Unauthorized สำหรับผู้ที่ไม่มีสิทธิ์ */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* เส้นทางใด ๆ ที่ไม่ตรงกันจะเปลี่ยนไป Home */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* ใส่ภายใน Route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
