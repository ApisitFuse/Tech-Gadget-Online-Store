import React, { useState } from 'react';
import { fetchSupSendEmailTokenAPI } from '../services/SendEmail';
import { SuccessModal, LoadingModal } from '../layout/Modal';

const SupSendEmailToken = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    // const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setError('');
        setMessage('');
        setErrors({});
        setIsLoading(true);

        try {
            const response = await fetchSupSendEmailTokenAPI(email, role);

            if (!response.ok) {
                const data = await response.json();
                setErrors(data.errors.reduce((acc, err) => ({ ...acc, [err.path]: err.msg }), {}));
                // setError('Send email is failed');
                setMessage('Send email is failed');
                setIsSuccess(false);
                return;
            }

            const data = await response.json();
            setMessage(data.message);
            setIsSuccess(true);
        } catch (err) {
            // setError(err.response?.data?.message || 'Failed to send email.');
            setMessage('Failed to send email.');
            setIsSuccess(false);

        } finally {
            setIsLoading(false);
            setIsModalOpen(true);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 4000);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Send Email Token to User</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        User Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-b-2 border-b-red-600' : ''}`}
                        placeholder="Enter user's email"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.role ? 'border-b-2 border-b-red-600' : ''}`}
                    >
                        <option value="" disabled hidden >
                            Select role
                        </option>
                        <option value="2">Admin</option>
                        <option value="3">Seller</option>
                    </select>
                    {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Send Token
                </button>
            </form>

            <LoadingModal isOpen={isLoading} />
            <SuccessModal isOpen={isModalOpen} isSuccess={isSuccess} message={message} onClose={closeModal} />

            {/* {message && <p className="text-green-500 mt-4">{message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>} */}
        </div>
    );
};

export default SupSendEmailToken;
