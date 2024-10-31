import React from 'react';

export const LoadingModal = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
                </div>
                <p className="text-gray-700 font-bold">Loading...</p>
            </div>
        </div>
    );
};

export const SuccessModal = ({ isOpen, isSuccess, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="flex flex-col items-center">
                    <div
                        className={`flex items-center justify-center w-16 h-16 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                        {isSuccess ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-800">
                        {isSuccess ? 'Success' : 'Failed'}
                    </h2>
                    <p className="text-gray-600 text-center mt-2">
                        {message || (isSuccess ? 'Email sent successfully!' : 'Failed to send email.')}
                    </p>

                    <button
                        onClick={onClose}
                        className={`mt-4 px-4 py-2 rounded-lg focus:outline-none ${isSuccess
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                    >
                        {isSuccess ? 'OK' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};

