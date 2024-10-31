import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchSellerRegisterAPI, fetchRequestTokenAPI } from '../services/authenticationService';
import { fetchDecryptEmailAPI } from '../services/SendEmail';

const SellerRegisterPage = ({ setIsLoggedIn, setUserRole }) => {
    const [GID, setGID] = useState('');
    const [globalName, setGlobalName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [token, setToken] = useState('');
    const [decryptedEmail, setDecryptedEmail] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const encryptedEmail = queryParams.get('email');

        if (encryptedEmail) {
            const fetchDecrypt = async () => {
                try {
                    const response = await fetchDecryptEmailAPI(encryptedEmail);
                    if (response.ok) {
                        const data = await response.json();
                        setDecryptedEmail(data.decryptedEmail);
                    } else {
                        console.error('Failed to retrieve email');
                    }
                } catch (error) {
                    console.error('Error fetching decrypted email:', error);
                }
            };

            fetchDecrypt();
        }
    }, [location.search]);

    useEffect(() => {

        if (decryptedEmail) {

            // เมื่อผู้ใช้เข้าสู่หน้า เราจะส่ง request เพื่อขอ token
            const fetchToken = async () => {
                try {
                    const response = await fetchRequestTokenAPI(decryptedEmail);

                    if (response.ok) {
                        const data = await response.json();
                        setToken(data.token);
                    } else {
                        console.error('Failed to retrieve token');
                    }
                } catch (error) {
                    console.error('Error fetching token:', error);
                }
            };

            fetchToken();
        }

    }, [decryptedEmail]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await fetchSellerRegisterAPI(token, GID, globalName, email, password, confirmPassword);

            const data = await response.json();

            if (response.ok) {
                setMessage('Registration successful!');
                setIsLoggedIn(true);
                setUserRole(data.role);

                navigate('/seller');

            } else {
                setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
                setMessage('Registration failed');
                return;
            }
        } catch (err) {
            console.error('Error registering user:', err);
            setMessage('Error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Seller Register</h2>
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

export default SellerRegisterPage;
