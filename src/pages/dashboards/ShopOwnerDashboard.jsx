import React, { useState } from 'react';
import OrdersManagement from './../../components/shopowner/OrdersManagement';
import Sidebar from '../../components/shopowner/Sidebar';
import QuoteAcceptance from './../../components/shopowner/QuoteAcceptance';
import DeliveryQuoteRequest from './../../components/shopowner/DeliveryQuoteRequest';
import Cart from '../../components/shopowner/Cart';
import MyBookings from '../../components/shopowner/MyBookings';
import DashboardFooter from '../../components/common/DashboardFooter';



const ShopOwnerDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'orders': return <OrdersManagement/>;
      case 'Cart': return <Cart/>;
      case 'delivery-quoteRequest': return <DeliveryQuoteRequest/>;
      case 'quote-acceptance': return <QuoteAcceptance />;
      case 'my-bookings': return <MyBookings />;
      default: return <OrdersManagement />;
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

export default ShopOwnerDashboard;

