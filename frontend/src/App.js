import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './login/Register';
import AdminRegister from './login/AdminRegister';
import SellerRegister from './login/SellerRegister';
import Login from './login/Login';
import ChangePassword from './login/ChangePassword';
import Profile from './user/Profile';
import Home from './general/Home';
import Navigation from './layout/Navigation';
import Unauthorized from './error/Unauthorized';
import SuperAdmin from './super_admin/SuperAdmin';
import SupSendEmailToken from './super_admin/SupSendEmailToken';
import AdminSendEmailToken from './admin/AdminSendEmailToken';
import Admin from './admin/Admin';
import Seller from './seller/Seller';
import Customer from './customer/Customer';
import { fetchCheckAuthAPI } from './services/authenticationService';
import "./tailwind.css";

// สร้าง PrivateRoute component เพื่อป้องกันการเข้าถึงเส้นทาง
const PrivateRoute = ({ element: Component, allowedRoles, userRole, ...rest }) => {

  if (!rest.isLoggedIn) {
    return <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-red-500">Access Denied</h1>
      <p className="mb-4 text-gray-700">You must be logged in to access this page.</p>
      <Link to="/login" className="text-blue-500 underline">
        Go to Login Page
      </Link>
    </div>;
  }
  if (!userRole) {
    return <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      <p className="mt-4 text-gray-700">Loading, please wait...</p>
    </div>;
  }
  return allowedRoles.includes(userRole) ? (
    Component
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // ตรวจสอบการ login ทุกครั้งที่ component นี้ render
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchCheckAuthAPI();

        const data = await response.json();

        if (response.status === 403) {
          console.log(data.message);
        } else if (response.status === 200) {
          setUserRole(data.user.role);
          if (data.isLoggedIn) {
            setIsLoggedIn(true);
          }
        } else {
          console.error('Some error occur during checking authentication:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRole={userRole} setUserRole={setUserRole} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route path="/admin_register" element={<AdminRegister setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route path="/seller_register" element={<SellerRegister setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />

          {/* ตัวอย่างการใช้ PrivateRoute กับหน้า Super Admin */}
          <Route
            path="/profile"
            element={<PrivateRoute allowedRoles={['Super Admin', 'Admin', 'Seller', 'Customer']} userRole={userRole} element={<Profile />} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/super_admin"
            element={<PrivateRoute allowedRoles={['Super Admin']} userRole={userRole} element={<SuperAdmin />} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/super_admin_send_email_token"
            element={<PrivateRoute allowedRoles={['Super Admin']} userRole={userRole} element={<SupSendEmailToken />} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/admin_send_email_token"
            element={<PrivateRoute allowedRoles={['Admin']} userRole={userRole} element={<AdminSendEmailToken />} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/admin"
            element={<PrivateRoute allowedRoles={['Super Admin', 'Admin']} userRole={userRole} element={<Admin />} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/seller"
            element={<PrivateRoute allowedRoles={['Super Admin', 'Seller']} userRole={userRole} element={<Seller />} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/customer"
            element={<PrivateRoute allowedRoles={['Super Admin', 'Customer']} userRole={userRole} element={<Customer />} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/change_password"
            element={<PrivateRoute allowedRoles={['Super Admin', 'Customer', "Seller", "Customer"]} userRole={userRole} element={<ChangePassword />} isLoggedIn={isLoggedIn} />}
          />


          {/* หน้า Unauthorized สำหรับผู้ที่ไม่มีสิทธิ์ */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* เส้นทางใด ๆ ที่ไม่ตรงกันจะเปลี่ยนไป Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
