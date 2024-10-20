import React from 'react';

const CustomerPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Customer Dashboard</h1>
                <p className="text-gray-700 mb-6">
                    Welcome to the customer page! Only customers can see this.
                </p>
                <a 
                    href="/"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Go to Home
                </a>
            </div>
        </div>
    );
};

export default CustomerPage;