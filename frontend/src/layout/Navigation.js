import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <ul className="flex justify-center space-x-6">
        <li>
          <Link to="/" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Home</Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/register" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Register</Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Login</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/profile" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Profile</Link>
        </li>
        {isLoggedIn && (
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200">
            Logout
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
