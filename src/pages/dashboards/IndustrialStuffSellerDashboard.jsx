import React, { useState } from 'react';
import Sidebar from '../../components/industrialstuffseller/Sidebar';
import IndustrialStuffOrder from '../../components/industrialstuffseller/IndustrialStuffOrders';
import IndustrialStuffFishStockManagement from '../../components/industrialstuffseller/IndustrialStuffStockManagement';
import IndustrialStuffForm from '../../components/industrialstuffseller/IndustrialStuffForm';
import DashboardFooter from '../../components/common/DashboardFooter';


const IndustrialStuffSellerDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'industrial-stuff-orders': return <IndustrialStuffOrder />;
      case 'industrial-stuff-Stock-management': return <IndustrialStuffFishStockManagement />;
      case 'industrial-stuff-form': return <IndustrialStuffForm />;
      default: return <IndustrialStuffOrder/>;
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

export default IndustrialStuffSellerDashboard;
