import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLogoutAPI } from '../services/authenticationService';
import RoleBasedComponent from '../layout/RoleBased';


const Navigation = ({ isLoggedIn, setIsLoggedIn, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {

    const response = await fetchLogoutAPI();

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <ul className="flex justify-center space-x-6">
        <li>
          <Link to="/" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Home</Link>
        </li>
        <li>
          <Link to="/super_admin" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Super Admin</Link>
        </li>
        <RoleBasedComponent allowedRoles={['Admin']} userRole={userRole}>
          <li>
            <Link to="/admin" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Admin</Link>
          </li>
        </RoleBasedComponent>
        <li>
          <Link to="/seller" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Seller</Link>
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
