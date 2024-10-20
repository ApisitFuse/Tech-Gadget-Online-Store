import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAdminRegisterAPI } from '../services/authenticationService';

const AdminRegisterPage = ({ setIsLoggedIn, setUserRole }) => {
    const [error, setError] = useState('');
    const location = useLocation();
    const [GID, setGID] = useState('');
    const [globalName, setGlobalName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [roleId, setRoleId] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const token = new URLSearchParams(location.search).get('token');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Token not found');
        }
    }, [token]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await fetchAdminRegisterAPI(token, GID, globalName, email, password, confirmPassword, 2);

            const data = await response.json();

            if (response.ok) {
                setMessage('Registration successful!');
                setIsLoggedIn(true);
                setUserRole(data.role);

                navigate('/admin');

            } else {
                setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
                setMessage('Registration failed');
                return;
            }
        } catch (err) {
            console.error('Error registering user:', error);
            setMessage('Error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {error && <p>{error}</p>}
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="GID"
                            value={GID}
                            onChange={(e) => setGID(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.GID ? 'border-b-2 border-b-red-600' : ''}`}
                        />
                        {errors.GID && (
                            <p className="text-red-600 text-sm mt-1">{errors.GID}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Global Name"
                            value={globalName}
                            onChange={(e) => setGlobalName(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.globalName ? 'border-b-2 border-b-red-600' : ''}`}
                        />
                        {errors.globalName && (
                            <p className="text-red-600 text-sm mt-1">{errors.globalName}</p>
                        )}
                    </div>

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

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-b-2 border-b-red-600' : ''}`}
                        />
                        {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* <div className="mb-4">
                        <input
                            type="number"
                            placeholder="Role ID"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roleId ? 'border-b-2 border-b-red-600' : ''}`}
                        />
                        {errors.roleId && (
                            <p className="text-red-600 text-sm mt-1">{errors.roleId}</p>
                        )}
                    </div> */}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 transition duration-300"
                    >
                        Register
                    </button>
                </form>
                {message && <p className="text-red-500 text-center mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default AdminRegisterPage;
