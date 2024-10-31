import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChangePasswordAPI } from '../services/authenticationService';

const ChangePasswordPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await fetchChangePasswordAPI(oldPassword, newPassword, confirmNewPassword);

            const data = await response.json();

            if (response.ok) {
                setMessage('Change password successful!');

                navigate('/profile');

            } else {
                setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
                setMessage('Change password failed');
                return;
            }
        } catch (err) {
            console.error('Error change password:', err);
            setMessage('Error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword}>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.oldPassword ? 'border-b-2 border-b-red-600' : ''}`}
                        />
                        {errors.oldPassword && (
                            <p className="text-red-600 text-sm mt-1">{errors.oldPassword}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.newPassword ? 'border-b-2 border-b-red-600' : ''}`}
                        />
                        {errors.newPassword && (
                            <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmNewPassword ? 'border-b-2 border-b-red-600' : ''}`}
                        />
                        {errors.confirmNewPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmNewPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 transition duration-300"
                    >
                        Change
                    </button>
                </form>
                {message && <p className="text-red-500 text-center mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default ChangePasswordPage;
