import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLoginAPI } from '../services/authenticationService';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ใช้สำหรับการเปลี่ยนหน้า


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchLoginAPI(email, password);

      if (response) {  // ตรวจสอบว่า response ถูกส่งคืนอย่างถูกต้อง
        setMessage('Login successful!');
        localStorage.setItem('token', response.token);
        setIsLoggedIn(true);
        navigate('/profile');
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      setMessage('Error occurred');
    }
    
    // try {
    //   const response = await fetchLoginAPI(email, password);
    //   // const response = await fetch('http://localhost:8000/api/auth/login', {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'Content-Type': 'application/json',
    //   //   },
    //   //   body: JSON.stringify({ email, password }),
    //   // }); 

    //   if (response.ok) {
    //     const data = await response.json();
    //     setMessage('Login successful!');
    //     localStorage.setItem('token', data.token); // เก็บ token ใน localStorage

    //     setIsLoggedIn(true); // อัปเดตสถานะการ login
    //     navigate('/profile');

    //   } else {
    //     setMessage('Login failed');
    //   }
    // } catch (error) {
    //   console.error('Error logging in user:', error);
    //   setMessage('Error occurred');
    // }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 transition duration-300"
          >
            Login
          </button>
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </div>
    </div>
    // <div>
    //   <h2>Login</h2>
    //   <form onSubmit={handleLogin}>
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />
    //     <button type="submit">Login</button>
    //   </form>
    //   {message && <p>{message}</p>}
    // </div>
  );
};

export default Login;
