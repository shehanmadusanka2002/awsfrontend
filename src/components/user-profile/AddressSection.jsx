import React from 'react';
import { sriLankanDistricts } from './locationData';

const AddressSection = ({
    profile,
    isEditing,
    onInputChange,
    errors,
    availableTowns
}) => {
    if (isEditing) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Place (House No, Building) *</label>
                    <input 
                        type="text" 
                        name="addressPlace" 
                        value={profile.addressPlace || ''} 
                        onChange={onInputChange} 
                        className={`w-full p-3 border rounded-md transition-colors ${
                            errors.addressPlace ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        placeholder="House number, building name"
                    />
                    {errors.addressPlace && <p className="text-red-500 text-sm mt-1">{errors.addressPlace}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Street *</label>
                    <input 
                        type="text" 
                        name="addressStreet" 
                        value={profile.addressStreet || ''} 
                        onChange={onInputChange} 
                        className={`w-full p-3 border rounded-md transition-colors ${
                            errors.addressStreet ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        placeholder="Street name"
                    />
                    {errors.addressStreet && <p className="text-red-500 text-sm mt-1">{errors.addressStreet}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">District *</label>
                    <select 
                        name="addressDistrict" 
                        value={profile.addressDistrict || ''} 
                        onChange={onInputChange} 
                        className={`w-full p-3 border rounded-md bg-white transition-colors ${
                            errors.addressDistrict ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    >
                        <option value="">Select a District</option>
                        {sriLankanDistricts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                    {errors.addressDistrict && <p className="text-red-500 text-sm mt-1">{errors.addressDistrict}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Town *</label>
                    <select 
                        name="addressTown" 
                        value={profile.addressTown || ''} 
                        onChange={onInputChange} 
                        disabled={!profile.addressDistrict}
                        className={`w-full p-3 border rounded-md bg-white transition-colors ${
                            errors.addressTown ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            !profile.addressDistrict ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                    >
                        <option value="">
                            {!profile.addressDistrict ? 'First select a district' : 'Select a town'}
                        </option>
                        {availableTowns.map(town => (
                            <option key={town} value={town}>{town}</option>
                        ))}
                    </select>
                    {errors.addressTown && <p className="text-red-500 text-sm mt-1">{errors.addressTown}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-gray-800">
                <p className="mb-1">
                    <span className="font-medium">Address:</span> {profile.addressPlace || 'Not set'}, {profile.addressStreet || ''}
                </p>
                <p>
                    <span className="font-medium">Location:</span> {profile.addressTown || 'Not set'}, {profile.addressDistrict || 'Not set'}
                </p>
            </div>
        </div>
    );
};

export default AddressSection;
