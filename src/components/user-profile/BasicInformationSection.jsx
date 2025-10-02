import React from 'react';
import FilePreview from './FilePreview';

const BasicInformationSection = ({
    profile,
    isEditing,
    onInputChange,
    onFileChange,
    errors,
    logoFile
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow space-y-4">
                {/* Business Name */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Business Name *</label>
                    {isEditing ? (
                        <>
                            <input 
                                type="text" 
                                name="businessName" 
                                value={profile.businessName || ''} 
                                onChange={onInputChange} 
                                className={`w-full p-3 border rounded-md transition-colors ${
                                    errors.businessName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="Enter your business name"
                            />
                            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                        </>
                    ) : (
                        <p className="text-gray-800 text-lg">{profile.businessName || 'Not set'}</p>
                    )}
                </div>

                {/* Business Type */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Business Type *</label>
                    {isEditing ? (
                        <>
                            <select 
                                name="businessType" 
                                value={profile.businessType || ''} 
                                onChange={onInputChange}
                                className={`w-full p-3 border rounded-md bg-white transition-colors ${
                                    errors.businessType ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            >
                                <option value="">Select Business Type</option>
                                <option value="Sole Proprietorship">Sole Proprietorship</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Private Limited Company">Private Limited Company</option>
                                <option value="Public Limited Company">Public Limited Company</option>
                                <option value="Non-Profit Organization">Non-Profit Organization</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                        </>
                    ) : (
                        <p className="text-gray-800">{profile.businessType || 'Not set'}</p>
                    )}
                </div>
            </div>

            {/* Logo Section */}
            <div className="flex-shrink-0 text-center">
                <label className="block text-gray-700 font-semibold mb-2">Business Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <FilePreview 
                        fileUrl={profile.logoUrl} 
                        newFile={logoFile} 
                        altText="Business Logo" 
                        className="w-32 h-32 mx-auto"
                    />
                    {!profile.logoUrl && !logoFile && (
                        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-sm">No Logo</span>
                        </div>
                    )}
                    {isEditing && (
                        <input 
                            type="file" 
                            name="logo" 
                            onChange={onFileChange}
                            accept="image/*"
                            className="mt-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BasicInformationSection;
