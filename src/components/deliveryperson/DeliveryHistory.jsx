import React, { useState, useEffect } from 'react';

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock delivery history data - UPDATED (customerSignature removed)
  const mockDeliveries = [
    {
      id: 1,
      orderId: 'ORD001',
      quoteId: 'QT001',
      customerName: 'Saman Perera',
      customerPhone: '0771234567',
      orderItems: [
        { name: 'Gold Fish', quantity: 5, price: 500 },
        { name: 'Aquarium Filter', quantity: 1, price: 3500 }
      ],
      orderTotal: 6000,
      pickupLocation: {
        address: 'Aqualink Fish Store, Main Road',
        town: 'Colombo 03',
        district: 'Colombo',
        province: 'Western'
      },
      deliveryLocation: {
        address: '123 Main Street, Galle Road',
        town: 'Dehiwala',
        district: 'Colombo',
        province: 'Western'
      },
      deliveryFee: 1200,
      status: 'DELIVERED',
      startTime: '2025-09-02T09:30:00',
      completedTime: '2025-09-02T11:15:00',
      deliveryTime: '1h 45m',
      rating: 5,
      feedback: 'Excellent service, fish arrived in perfect condition!',
      confirmationCode: 'ABC123',
      deliveryNotes: 'Fish were healthy and active upon delivery. Customer was very satisfied.'
    },
    {
      id: 2,
      orderId: 'ORD002',
      quoteId: 'QT002',
      customerName: 'Kamal Silva',
      customerPhone: '0779876543',
      orderItems: [
        { name: 'Tropical Fish Mix', quantity: 8, price: 400 },
        { name: 'Water Conditioner', quantity: 1, price: 1200 }
      ],
      orderTotal: 4400,
      pickupLocation: {
        address: 'Aqualink Fish Store, Main Road',
        town: 'Colombo 03',
        district: 'Colombo',
        province: 'Western'
      },
      deliveryLocation: {
        address: '456 Beach Road, Near Police Station',
        town: 'Negombo',
        district: 'Gampaha',
        province: 'Western'
      },
      deliveryFee: 1500,
      status: 'DELIVERED',
      startTime: '2025-09-01T14:00:00',
      completedTime: '2025-09-01T16:30:00',
      deliveryTime: '2h 30m',
      rating: 4,
      feedback: 'Good delivery, but slightly delayed',
      confirmationCode: 'XYZ789',
      deliveryNotes: 'Minor delay due to traffic, but customer understood. Items delivered safely.'
    },
    {
      id: 3,
      orderId: 'ORD003',
      quoteId: 'QT003',
      customerName: 'Nimal Fernando',
      customerPhone: '0712345678',
      orderItems: [
        { name: 'Large Aquarium Tank (50L)', quantity: 1, price: 15000 }
      ],
      orderTotal: 15000,
      pickupLocation: {
        address: 'Aqualink Fish Store, Main Road',
        town: 'Colombo 03',
        district: 'Colombo',
        province: 'Western'
      },
      deliveryLocation: {
        address: '789 Temple Road, University Area',
        town: 'Peradeniya',
        district: 'Kandy',
        province: 'Central'
      },
      deliveryFee: 2200,
      status: 'CANCELLED',
      startTime: '2025-08-31T10:00:00',
      completedTime: null,
      deliveryTime: null,
      rating: null,
      feedback: 'Customer cancelled - not available',
      confirmationCode: null,
      deliveryNotes: null
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, dateFilter, statusFilter, searchTerm]);

  const filterDeliveries = () => {
    let filtered = [...deliveries];

    if (statusFilter) {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(delivery => 
            new Date(delivery.startTime).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(delivery => 
            new Date(delivery.startTime) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(delivery => 
            new Date(delivery.startTime) >= filterDate
          );
          break;
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.deliveryLocation.town.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    setFilteredDeliveries(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'RETURNED': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'border-green-300';
      case 'CANCELLED': return 'border-red-300';
      case 'RETURNED': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery History</h1>
              <p className="text-gray-600">Track and review your completed deliveries</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4 lg:mt-0">
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {deliveries.filter(d => d.status === 'DELIVERED').length}
                </div>
                <div className="text-xs text-green-600">Delivered</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                <div className="text-2xl font-bold text-red-800">
                  {deliveries.filter(d => d.status === 'CANCELLED').length}
                </div>
                <div className="text-xs text-red-600">Cancelled</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{deliveries.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by customer, order ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURNED">Returned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setDateFilter('');
                  setStatusFilter('');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {filteredDeliveries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No delivery history found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter || dateFilter 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'Your completed deliveries will appear here.'
                }
              </p>
            </div>
          ) : (
            filteredDeliveries.map(delivery => (
              <div key={delivery.id} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${getBorderColor(delivery.status)}`}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order #{delivery.orderId}</h3>
                        <p className="text-gray-600">{delivery.customerName}</p>
                        <p className="text-sm text-gray-500">
                          Started: {formatDateTime(delivery.startTime)}
                        </p>
                        {delivery.completedTime && (
                          <p className="text-sm text-gray-500">
                            Completed: {formatDateTime(delivery.completedTime)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold mb-2 ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </div>
                      <div className="text-2xl font-bold text-green-600">{formatPrice(delivery.deliveryFee)}</div>
                      <div className="text-sm text-gray-600">Delivery Fee</div>
                      {delivery.deliveryTime && (
                        <div className="text-sm text-gray-500 mt-1">{delivery.deliveryTime}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Delivery Route
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                          <span className="font-semibold text-gray-900">PICKUP FROM</span>
                        </div>
                        <div className="ml-7 space-y-1">
                          <p className="text-gray-800 font-medium">{delivery.pickupLocation.address}</p>
                          <p className="text-gray-600">
                            {delivery.pickupLocation.town}, {delivery.pickupLocation.district}
                          </p>
                          <p className="text-sm text-gray-500">{delivery.pickupLocation.province} Province</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                          <span className="font-semibold text-gray-900">DELIVERED TO</span>
                        </div>
                        <div className="ml-7 space-y-1">
                          <p className="text-gray-800 font-medium">{delivery.deliveryLocation.address}</p>
                          <p className="text-gray-600">
                            {delivery.deliveryLocation.town}, {delivery.deliveryLocation.district}
                          </p>
                          <p className="text-sm text-gray-500">{delivery.deliveryLocation.province} Province</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-blue-100 rounded-lg p-3">
                      <p className="text-blue-800 font-medium text-center">
                        🚚 Route: {delivery.pickupLocation.town} → {delivery.deliveryLocation.town}
                        {delivery.pickupLocation.district !== delivery.deliveryLocation.district && 
                          ` (${delivery.pickupLocation.district} → ${delivery.deliveryLocation.district})`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order Items ({delivery.orderItems.length})
                    </h4>
                    <div className="space-y-2">
                      {delivery.orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded border border-gray-200">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-600 ml-2">x {item.quantity}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                            <div className="text-xs text-gray-500">({formatPrice(item.price)} each)</div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 px-3 bg-blue-100 rounded font-bold text-lg border-2 border-blue-300">
                        <span className="text-blue-900">Order Total:</span>
                        <span className="text-blue-900">{formatPrice(delivery.orderTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {delivery.status === 'DELIVERED' && delivery.confirmationCode && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Delivery Confirmed
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">Confirmation Code:</span>
                          <span className="font-mono font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                            {delivery.confirmationCode}
                          </span>
                        </div>
                      </div>
                      {delivery.deliveryNotes && (
                        <div className="pt-3 border-t border-green-200">
                          <span className="text-gray-600 text-sm font-semibold">Delivery Notes:</span>
                          <p className="mt-1 text-gray-800 text-sm">{delivery.deliveryNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {delivery.status === 'DELIVERED' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Customer Rating</h4>
                          {renderStars(delivery.rating)}
                        </div>
                        {delivery.feedback && (
                          <div className="flex-1 ml-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Feedback</h4>
                            <p className="text-gray-700 italic">"{delivery.feedback}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(delivery.status === 'CANCELLED' || delivery.status === 'RETURNED') && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Status Note
                      </h4>
                      <p className="text-red-700">{delivery.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;
