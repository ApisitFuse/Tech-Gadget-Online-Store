import React, { useState, useEffect } from 'react';
import RoleBasedComponent from '../layout/RoleBased';
import { fetchProfileAPI } from '../services/User';

const Home = ({ isLoggedIn }) => {
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const fetchProfile = async () => {
        try {

          const response = await fetchProfileAPI(); // Make sure this function includes token handling
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
            setUserRole(data.role); // Assuming role is part of the profile data
          } else {
            setMessage('Failed to load profile');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setMessage('Error occurred');
        }
      };

      fetchProfile();
    } else {
      setMessage('You are not logged in. Welcome, Guest');
    }
  }, [ isLoggedIn ]);

  return (
    <div className="container mx-auto p-4">
      {message && <p className="text-red-500">{message}</p>}

      {profile ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mt-4">Welcome, {profile.globalName}</h1>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mt-4">Welcome, Guest</h1>
          <p className="mt-2 text-gray-600">Please log in to access more features.</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">All User Content</h2>
        <p className="mt-2 text-gray-600">This content is visible to all users.</p>
      </div>

      <RoleBasedComponent allowedRoles={['Super Admin', 'Admin']} userRole={userRole}>
        <div className="mt-8 bg-gray-100 p-4 rounded shadow-lg">
          <h2 className="text-2xl font-semibold">Super Admin or Admin Content</h2>
          <p className="mt-2 text-gray-600">This content is visible only to Super Admins and Admins.</p>
        </div>
      </RoleBasedComponent>

      <RoleBasedComponent allowedRoles={['Seller']} userRole={userRole}>
        <div className="mt-8 bg-blue-100 p-4 rounded shadow-lg">
          <h2 className="text-2xl font-semibold">Seller Content</h2>
          <p className="mt-2 text-gray-600">This content is visible only to Sellers.</p>
        </div>
      </RoleBasedComponent>
    </div>
  );
};

export default Home;