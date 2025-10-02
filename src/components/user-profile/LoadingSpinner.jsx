import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="bg-gray-100 min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{message}</p>
        </div>
    </div>
);

export default LoadingSpinner;
