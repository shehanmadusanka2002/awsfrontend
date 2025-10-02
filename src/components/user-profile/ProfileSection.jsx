import React from 'react';

const ProfileSection = ({ title, children, onEdit, isEditing }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {!isEditing && (
                <button 
                    onClick={onEdit} 
                    className="text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                    Edit
                </button>
            )}
        </div>
        {children}
    </div>
);

export default ProfileSection;
