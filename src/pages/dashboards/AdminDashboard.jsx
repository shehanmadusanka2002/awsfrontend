
import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import UserVerification from '../../components/admin/UserVerification';
import ProductManagement from '../../components/admin/ProductManagement';
import UserManagement from '../../components/admin/UserManagement';
import ReviewsManagement from '../../components/admin/ReviewsManagement';
import EarningsManagement from '../../components/admin/EarningsManagement';
import BannerManagement from '../../components/admin/BannerManagement';
import StuffManagement from '../../components/admin/StuffManagement';
import ServicesManagement from '../../components/admin/ServicesManagement';
import DashboardFooter from '../../components/common/DashboardFooter';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'user-verification': return <UserVerification />;
      case 'product-management': return <ProductManagement />;
      case 'Stuff-management': return <StuffManagement />;
      case 'Service-management': return <ServicesManagement />;
      case 'user-management': return <UserManagement />;
      case 'reviews': return <ReviewsManagement />;
      case 'earnings': return <EarningsManagement />;
      case 'banners': return <BannerManagement />;
      default: return <UserVerification />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar */}
      <Sidebar 
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col flex-1">
        <main className="p-4 lg:p-8 flex-1">
          {renderComponent()}
        </main>
        
        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;
