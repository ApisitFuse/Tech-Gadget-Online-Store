import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './login/Register';
import Login from './login/Login';
import Profile from './user/Profile';
import Home from './general/Home';
import Navigation from './layout/Navigation';
import "./tailwind.css";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ตรวจสอบการ login ทุกครั้งที่ component นี้ render
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("useEffect");
    if (token) {
      setIsLoggedIn(true); // ถ้ามี token ให้ถือว่าผู้ใช้ login อยู่
    }
  }, []); // เช็คแค่ครั้งแรกที่ component mount

  // const isLoggedIn = !!localStorage.getItem('token'); // ตรวจสอบสถานะการ Login
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* <nav className="bg-blue-600 p-4 shadow-md">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link
                to="/register"
                className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300"
              >
                Profile
              </Link>
            </li>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            )}
          </ul>
        </nav> */}
        <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
