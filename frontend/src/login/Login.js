import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLoginAPI } from '../services/authenticationService';

const Login = ({ setIsLoggedIn, setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await fetchLoginAPI(email, password);

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        setIsLoggedIn(true);
        setUserRole(data.role);


        // พาผู้ใช้ไปยังหน้าเฉพาะตาม role
        if (data.role === 'Super Admin') {
          navigate('/super_admin');
        } else if (data.role === 'Admin') {
          navigate('/admin');
        } else if (data.role === 'Seller') {
          navigate('/seller');
        } else if (data.role === 'Customer') {
          navigate('/customer');
        } else {
          navigate('/unauthorized');  // ถ้า role ไม่ตรงกัน ให้ไปยังหน้า Unauthorized
        }

      } else {
        setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
        setMessage('Login failed');
        return;
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      setMessage('Error occurred');
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-b-2 border-b-red-600' : ''}`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-b-2 border-b-red-600' : ''}`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 transition duration-300"
          >
            Login
          </button>
          {errors.general && (
            <p className="text-red-600 text-sm text-center mt-4">{errors.general}</p>
          )}
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
