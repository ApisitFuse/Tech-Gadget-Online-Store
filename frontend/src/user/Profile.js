import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            console.log(token)
            try {
                const response = await fetch('http://localhost:8000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // เพิ่ม 'Bearer ' ก่อน token
                    },
                });

                if (response.ok) {
                    const data = await response.json(); // แก้เป็น .json() แทน .text()
                    setProfile(data);
                } else {
                    setMessage('Failed to load profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage('Error occurred');
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>
                {profile ? (
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Global ID:</span>
                            <span>{profile.GID}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Name:</span>
                            <span>{profile.glocbalName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Email:</span>
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Role ID:</span>
                            <span>{profile.roleId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Created At:</span>
                            <span>{new Date(profile.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Updated At:</span>
                            <span>{new Date(profile.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-600 text-center">{message}</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
