import React, { useState } from 'react';
import AdminTestPanel from './AdminTestPanel';
import UserVerification from './UserVerification';
import { utils } from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const isAuthenticated = utils.isAuthenticated();

  const tabs = [
    { id: 'verification', name: 'User Verification', component: UserVerification },
    { id: 'test', name: 'Admin Test Panel', component: AdminTestPanel }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || UserVerification;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage user verification and system administration</p>
          
          {/* Authentication Status */}
          <div className="mt-4 p-3 rounded-lg border">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
              {isAuthenticated && (
                <span className="text-xs text-gray-500">
                  (Token: {utils.getToken()?.substring(0, 10)}...)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Aqualink Admin Dashboard - Version 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;