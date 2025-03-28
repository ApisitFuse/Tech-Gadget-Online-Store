
import React from 'react';

const SellerPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Seller Dashboard</h1>
                <p className="text-gray-700 mb-6">
                    Welcome to the seller page! Only sellers can see this.
                </p>
                <div className="flex justify-center space-x-4">
                    <a
                        href="/"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                        Go to Home
                    </a>
                    <a
                        href="/add_product"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                        Add Product
                    </a>
                    <a
                        href="/table_product"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                        Show Product
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SellerPage;