
import React, { useEffect, useRef } from 'react';
import { Fish, User, Settings, LogOut, Briefcase, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar({
  dashboardName,
  showProfileMenu,
  setShowProfileMenu,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profileMenuRef = useRef(null);

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
      }
    };

    // Add event listeners when menu is open
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showProfileMenu, setShowProfileMenu]);

  // Handle dashboard selection with navigation
  const handleDashboardSelect = (role) => {
    // Convert role to URL-friendly format
    const dashboardPath = role.toLowerCase().replace('_', '-').replace('_', '-');        //replace(/_/g, '-');
    
    // Navigate to the dashboard route
    navigate(`/dashboard/${dashboardPath}`);
    
    // Close the profile menu
    setShowProfileMenu(false);
  };

  // Handle user profile navigation
  const handleUserProfileSelect = () => {
    navigate('/user-profile');
    setShowProfileMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-14">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/"> 
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 mt-2 rounded-full">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full"/>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                AquaLink
              </h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-6">
            {!dashboardName && (
              <>
                <Link to="/cart" className="text-white font-medium hover:underline">
                  Shopping Cart
                </Link>
                <Link to="/blog" className="text-white font-medium hover:underline">
                  Blog
                </Link>
                <Link to="/about" className="text-white font-medium hover:underline">
                  About
                </Link>
                <Link to="/contact" className="text-white font-medium hover:underline">
                  Contact Us
                </Link>
              </>
            )}

            
            

            {/* Auth Buttons */}
            {!user && (
              <>
                <button 
                  onClick={() => window.dispatchEvent(new Event('show-login'))}
                  className="text-white font-medium hover:underline"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/register")}
                  className="ml-2 bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-1 rounded-full font-bold transition"
                >
                  Register
                </button>
              </>
            )}

            {/* Home Button - Only show on dashboard pages */}
            {dashboardName && (
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white font-medium hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-all duration-200"
                title="Go to Home"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
            )}

            {/* Profile Button */}
            {user && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 border-2 border-white flex items-center justify-center text-xl text-white focus:outline-none overflow-hidden"
                  title="Profile"
                >
                  {user.logoUrl ? (
                    <img 
                      src={user.logoUrl} 
                      alt="Profile Logo" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    // Default profile icon when no logo is uploaded
                    <svg 
                      className="w-6 h-6 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </button>

                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-20 backdrop-blur-sm">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {user.logoUrl ? (
                          <img 
                            src={user.logoUrl} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.businessName || "Welcome to AquaLink"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* User Profile Option */}
                      <button
                        className="flex items-center w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-700 transition-all duration-200 group"
                        onClick={handleUserProfileSelect}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">My Profile</p>
                          <p className="text-xs text-gray-500">Manage your account settings</p>
                        </div>
                      </button>

                      {/* Dashboard Section */}
                      {user.roles && user.roles.length > 0 && (
                        <>
                          <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dashboards</p>
                          </div>
                          
                          {user.roles.map((role) => (
                            <button
                              key={role}
                              className="flex items-center w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-700 transition-all duration-200 group"
                              onClick={() => handleDashboardSelect(role)}
                            >
                              <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-cyan-200 transition-colors">
                                <Briefcase className="w-4 h-4 text-cyan-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {role === "SHOP_OWNER"
                                    ? "Shop Owner"
                                    : role === "FARM_OWNER"
                                    ? "Farm Owner"
                                    : role === "EXPORTER"
                                    ? "Exporter"
                                    : role === "SERVICE_PROVIDER"
                                    ? "Service Provider"
                                    : role === "INDUSTRIAL_STUFF_SELLER"
                                    ? "Industrial Seller"
                                    : role === "DELIVERY_PERSON"
                                    ? "Delivery Person"
                                    : role === "ADMIN"
                                    ? "Administrator"
                                    : role}
                                </p>
                                <p className="text-xs text-gray-500">Access your dashboard</p>
                              </div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        className="flex items-center w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-all duration-200 group"
                        onClick={logout}
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sign Out</p>
                          <p className="text-xs text-gray-500">Logout from your account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
