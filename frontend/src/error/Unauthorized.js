import React from 'react';

const UnauthorizedPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
                <p className="text-gray-700">
                    You do not have permission to view this page.
                </p>
                <a 
                    href="/" 
                    className="mt-4 inline-block text-blue-500 hover:underline"
                >
                    Go back to Home
                </a>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
