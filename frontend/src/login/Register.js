import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ navigate เพื่อเปลี่ยนเส้นทาง
import { fetchRegisterAPI } from '../services/AuthenticationService';

const Register = ({ setIsLoggedIn }) => {
    const [GID, setGID] = useState('');
    const [glocbalName, setGlocbalName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // ใช้สำหรับการเปลี่ยนหน้า

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetchRegisterAPI(GID, glocbalName, email, password, roleId);

            if (response) {
                setMessage('Registration successful!');
                localStorage.setItem('token', response.token); // เก็บ token ใน localStorage
                setIsLoggedIn(true); // อัปเดตสถานะการ login
                navigate('/profile');
            } else {
                setMessage('Registration failed');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('Error occurred');
        }

        // try {
        //     const response = await fetch('http://localhost:8000/api/auth/register', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ GID, glocbalName, email, password, roleId }),
        //     });

        //     if (response.ok) {
        //         const data = await response.json();
        //         setMessage('Registration successful!');
        //         localStorage.setItem('token', data.token); // เก็บ token ใน localStorage
        //         setIsLoggedIn(true); // อัปเดตสถานะการ login
        //         navigate('/profile');
        //     } else {
        //         setMessage('Registration failed');
        //     }
        // } catch (error) {
        //     console.error('Error registering user:', error);
        //     setMessage('Error occurred');
        // }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="GID"
                        value={GID}
                        onChange={(e) => setGID(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Global Name"
                        value={glocbalName}
                        onChange={(e) => setGlocbalName(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                    <input
                        type="number"
                        placeholder="Role ID"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

export default Register;
