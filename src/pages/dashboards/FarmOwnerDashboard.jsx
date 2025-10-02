import React, { useState } from 'react';
import Sidebar from '../../components/farmowner/Sidebar';
import FishStockManagement from '../../components/farmowner/FishStockManagement';
import FishAdsForm from '../../components/farmowner/FishAdsForm';
import FarmOwnerOrderManagement from '../../components/farmowner/FarmOwnerOrderManagement';
import DashboardFooter from '../../components/common/DashboardFooter';



const FarmOwnerDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'fish-order': return <FarmOwnerOrderManagement/>;
      case 'fish-stock-management': return <FishStockManagement />;
      case 'fish-ads-form': return <FishAdsForm />;
      default: return <FarmOwnerOrderManagement />;
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

export default FarmOwnerDashboard;

