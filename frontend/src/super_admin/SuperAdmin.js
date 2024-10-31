import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminPage = () => {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Super Admin Dashboard</h1>
                <p className="text-gray-700 mb-6">
                    Welcome to the admin page! Only admins can see this.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Link
                        to="/super_admin_send_email_token"
                        className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 shadow-lg"
                    >
                        Send Email Token
                    </Link>
                    {/* <Link
                        to="/"
                        className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 shadow-lg"
                    >
                        Go to Home
                    </Link> */}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminPage;
