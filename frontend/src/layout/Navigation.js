import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLogoutAPI } from '../services/authenticationService';
import { fetchUserProfileAPI } from '../services/User';
import RoleBasedComponent from '../layout/RoleBased';


const Navigation = ({ isLoggedIn, setIsLoggedIn, userRole, setUserRole }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    console.log(isLoggedIn);
    console.log(userRole);

    const fetchUser = async () => {
      try {
        const response = await fetchUserProfileAPI();

        if (response.status === 403) {
          console.log("Invalid Access Token");
        } else if (response.status === 200) {
          const data = await response.json();
          if (data) {
            setUser(data);
          }
        } else {
          console.error('Some error occur during fetching user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    fetchUser();

  }, [isLoggedIn, userRole]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {

    const response = await fetchLogoutAPI();

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    setUser(null);
    setUserRole('');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <ul className="flex justify-center space-x-6">
        <div className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Home</Link>
          </li>
          <RoleBasedComponent allowedRoles={['Super Admin']} userRole={userRole}>
            <li>
              <Link to="/super_admin" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Super Admin</Link>
            </li>
          </RoleBasedComponent>
          <RoleBasedComponent allowedRoles={['Super Admin', 'Admin']} userRole={userRole}>
            <li>
              <Link to="/admin" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Admin</Link>
            </li>
          </RoleBasedComponent>
          <RoleBasedComponent allowedRoles={['Super Admin', 'Seller']} userRole={userRole}>
            <li>
              <Link to="/seller" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Seller</Link>
            </li>
          </RoleBasedComponent>
          <RoleBasedComponent allowedRoles={['Super Admin', 'Customer']} userRole={userRole}>
            <li>
              <Link to="/customer" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Customer</Link>
            </li>
          </RoleBasedComponent>
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

          {isLoggedIn && (
            <li>
              <Link to="/profile" className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Profile</Link>
            </li>
          )}

          {isLoggedIn && (
            <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200">
              Logout
            </button>
          )}
        </div>

        <div className="profile ml-auto flex items-center">
          {user && (
            <div className="flex items-center space-x-4">
              <h2 className="text-white">{user.email}</h2>
              <div className="relative">
                <img
                  src={`http://localhost:8000/uploads/profile/${user.profileImage}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  onClick={toggleDropdown}
                />
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">View Profile</a>
                    <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navigation;
