import React from 'react';

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-center items-center text-sm">
          {/* Centered Logo and Copyright */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="AquaLink Logo" className="w-6 h-6 rounded-full"/>
            <span className="font-semibold">AquaLink</span>
            <span className="text-cyan-200">
              © {currentYear} All rights reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;