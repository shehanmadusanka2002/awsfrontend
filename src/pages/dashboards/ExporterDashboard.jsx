import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardFooter from '../../components/common/DashboardFooter';
import { PencilSquareIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import BlogManagement from '../../components/blog/BlogManagement';
import BlogPostForm from '../../components/blog/BlogPostForm';

export default function ExporterDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Set the active tab based on URL path when component mounts or URL changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/Exporter/blog')) {
      setActiveTab('blog');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const renderMainContent = () => {
    // Check if we're on a specific blog route
    if (location.pathname.includes('/dashboard/Exporter/blog/create')) {
      return <BlogPostForm />;
    }
    
    if (location.pathname.match(/\/dashboard\/Exporter\/blog\/edit\/\d+/)) {
      return <BlogPostForm editMode={true} />;
    }
    
    // For the blog tab
    if (activeTab === 'blog') {
      return <BlogManagement />;
    }
    
    // Default dashboard overview
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Exporter Dashboard</h2>
        <p>Welcome to your exporter dashboard. Here you can manage your products, view analytics, and create blog posts to engage with your customers.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <PencilSquareIcon className="h-8 w-8 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Create Blog Posts</h3>
            </div>
            <p className="text-gray-600 mb-4">Share updates, news, and information about your products with your customers.</p>
            <Link 
              to="/dashboard/Exporter/blog" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage Blog →
            </Link>
          </div>
          
          {/* More dashboard cards can be added here */}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab('overview');
                navigate('/dashboard/Exporter');
              }}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'blog'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab('blog');
                navigate('/dashboard/Exporter/blog');
              }}
            >
              <div className="flex items-center">
                <NewspaperIcon className="h-5 w-5 mr-1" />
                Blog Management
              </div>
            </button>
            {/* More tabs can be added here */}
          </div>
        </div>
      </div>
      
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {renderMainContent()}
      </main>
      
      {/* Footer */}
      <DashboardFooter />
    </div>
  )
}