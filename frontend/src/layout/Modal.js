import React from 'react';
import { useState } from "react";

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

export const ConfirmDeleteModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-4">{message}</h3>
                <div className="flex justify-end space-x-2">
                    <button 
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        onClick={onCancel}
                    >
                        ยกเลิก
                    </button>
                    <button 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
    );
}

export const ImageModal = ({ imageUrl, altText }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* รูปภาพขนาดเล็ก */}
            <img
                src={imageUrl}
                alt={altText}
                className="w-12 h-12 object-cover mx-auto cursor-pointer"
                onClick={() => setIsOpen(true)}
            />

            {/* Modal แสดงภาพขยาย */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-2 rounded-lg">
                        {/* ปุ่มปิด */}
                        {/* <button
                            className="absolute top-2 right-2 bg-red-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 focus:outline-none shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105"
                            onClick={() => setIsOpen(false)}
                        >
                            ✖
                        </button> */}
                        <button
                            className="absolute top-4 right-4 bg-transparent text-gray-800 hover:text-red-600 focus:outline-none transition-all duration-300 ease-in-out rounded-full p-2 border-2 border-gray-300 hover:border-red-600 transform hover:scale-110"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* แสดงภาพขนาดใหญ่ */}
                        <img
                            src={imageUrl}
                            alt={altText}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
