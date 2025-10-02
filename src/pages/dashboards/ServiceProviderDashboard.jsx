import React, { useState } from 'react';
import Sidebar from '../../components/serviceprovider/Sidebar';
import ServiceHistory from '../../components/serviceprovider/ServiceHistory';
import ServiceRequests from './../../components/serviceprovider/ServiceRequests';
import ServiceAdsForm from '../../components/serviceprovider/ServiceAdsForm';
import DashboardFooter from '../../components/common/DashboardFooter';



const ServiceProviderDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'fish-order': return <ServiceRequests />;
      case 'service-history': return <ServiceHistory />;
      case 'service-ads-form': return <ServiceAdsForm />;
      default: return <ServiceRequests />;
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

export default ServiceProviderDashboard;

