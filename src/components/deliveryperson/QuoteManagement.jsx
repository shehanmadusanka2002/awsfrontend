import React, { useState, useEffect } from 'react';

const QuoteManagement = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock quotes data - All created quotes
  const mockQuotes = [
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
      quotePrice: 1200,
      deliveryDate: '2025-10-10',
      validUntil: '2025-09-06T10:30:00',
      createdAt: '2025-09-04T11:15:00',
      status: 'PENDING', // PENDING, ACCEPTED, REJECTED, EXPIRED
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
      }
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
      quotePrice: 1500,
      deliveryDate: '2025-09-08',
      validUntil: '2025-09-05T16:00:00',
      createdAt: '2025-09-04T09:30:00',
      status: 'ACCEPTED',
      pickupLocation: {
        address: 'Aqualink Fish Store, Main Road',
        town: 'Colombo 03',
        district: 'Colombo',
        province: 'Western'
      },
      deliveryLocation: {
        address: '456 Beach Road',
        town: 'Negombo',
        district: 'Gampaha',
        province: 'Western'
      }
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
      quotePrice: 2000,
      deliveryDate: '2025-09-12',
      validUntil: '2025-09-05T18:00:00',
      createdAt: '2025-09-03T14:20:00',
      status: 'REJECTED',
      pickupLocation: {
        address: 'Aqualink Fish Store, Main Road',
        town: 'Colombo 03',
        district: 'Colombo',
        province: 'Western'
      },
      deliveryLocation: {
        address: '789 Temple Road',
        town: 'Peradeniya',
        district: 'Kandy',
        province: 'Central'
      }
    },
    {
      id: 4,
      orderId: 'ORD004',
      quoteId: 'QT004',
      customerName: 'Priya Jayawardena',
      customerPhone: '0764567890',
      orderItems: [
        { name: 'Betta Fish Pair', quantity: 2, price: 1500 },
        { name: 'Small Tank (10L)', quantity: 2, price: 2500 }
      ],
      orderTotal: 7000,
      quotePrice: 800,
      deliveryDate: '2025-09-07',
      validUntil: '2025-09-04T20:00:00',
      createdAt: '2025-09-03T16:45:00',
      status: 'EXPIRED',
      pickupLocation: {
        address: 'Aqualink Fish Store, Main Road',
        town: 'Colombo 03',
        district: 'Colombo',
        province: 'Western'
      },
      deliveryLocation: {
        address: '321 Coral Gardens',
        town: 'Colombo 07',
        district: 'Colombo',
        province: 'Western'
      }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setQuotes(mockQuotes);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'ACCEPTED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'EXPIRED': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600';
      case 'ACCEPTED': return 'text-green-600';
      case 'REJECTED': return 'text-red-600';
      case 'EXPIRED': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'PENDING': return 'border-yellow-300';
      case 'ACCEPTED': return 'border-green-300';
      case 'REJECTED': return 'border-red-300';
      case 'EXPIRED': return 'border-gray-300';
      default: return 'border-blue-300';
    }
  };

  const isValidityExpired = (validUntil) => {
    return new Date() > new Date(validUntil);
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = filterStatus === 'all' || quote.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = !searchTerm || 
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quoteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.deliveryLocation.town.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Management</h1>
              <p className="text-gray-600">Manage and track all your delivery quotes</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-800">
                  {quotes.filter(q => q.status === 'PENDING').length}
                </div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {quotes.filter(q => q.status === 'ACCEPTED').length}
                </div>
                <div className="text-xs text-green-600">Accepted</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                <div className="text-2xl font-bold text-red-800">
                  {quotes.filter(q => q.status === 'REJECTED').length}
                </div>
                <div className="text-xs text-red-600">Rejected</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{quotes.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by customer, order ID, quote ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Quotes</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Quotes */}
        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No quotes found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'Your created quotes will appear here.'
                }
              </p>
            </div>
          ) : (
            filteredQuotes.map(quote => (
              <div key={quote.id} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${getBorderColor(quote.status)}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Quote #{quote.quoteId}</h3>
                        <p className="text-gray-600">Order #{quote.orderId} - {quote.customerName}</p>
                        <p className="text-sm text-gray-500">
                          Created: {formatDateTime(quote.createdAt)}
                        </p>
                        <div className="flex items-center mt-1">
                          <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs font-medium text-gray-600">
                            Valid Until: {formatDateTime(quote.validUntil)}
                            {isValidityExpired(quote.validUntil) && (
                              <span className="text-red-600 ml-2">⚠️ EXPIRED</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold mb-2 ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </div>
                      <div className="text-2xl font-bold text-green-600">{formatPrice(quote.quotePrice)}</div>
                      <div className="text-sm text-gray-600">Quote Price</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Quote Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Quote Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-blue-700">Quote Price:</span> <span className="font-medium">{formatPrice(quote.quotePrice)}</span></p>
                        <p><span className="text-blue-700">Order Value:</span> <span className="font-medium">{formatPrice(quote.orderTotal)}</span></p>
                        <p><span className="text-blue-700">Delivery Date:</span> <span className="font-medium">{formatDate(quote.deliveryDate)}</span></p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Route Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-green-700">From:</span> <span className="font-medium">{quote.pickupLocation.town}</span></p>
                        <p><span className="text-green-700">To:</span> <span className="font-medium">{quote.deliveryLocation.town}</span></p>
                        <p><span className="text-green-700">Route:</span> <span className="font-medium">
                          {quote.pickupLocation.district !== quote.deliveryLocation.district 
                            ? `${quote.pickupLocation.district} → ${quote.deliveryLocation.district}`
                            : `Within ${quote.pickupLocation.district}`
                          }
                        </span></p>
                      </div>
                    </div>

                    <div className={`rounded-lg p-4 border ${
                      quote.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' :
                      quote.status === 'ACCEPTED' ? 'bg-green-50 border-green-200' :
                      quote.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className={`font-semibold mb-2 ${
                        quote.status === 'PENDING' ? 'text-yellow-900' :
                        quote.status === 'ACCEPTED' ? 'text-green-900' :
                        quote.status === 'REJECTED' ? 'text-red-900' :
                        'text-gray-900'
                      }`}>Status Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className={getStatusTextColor(quote.status)}>Status:</span> <span className="font-medium">{quote.status}</span></p>
                        <p><span className="text-gray-700">Items:</span> <span className="font-medium">{quote.orderItems.length} items</span></p>
                        <p><span className="text-gray-700">Created:</span> <span className="font-medium">{formatDate(quote.createdAt)}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* DELIVERY ROUTE */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Delivery Route
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* FROM Location */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                          <span className="font-semibold text-gray-900">PICKUP FROM</span>
                        </div>
                        <div className="ml-7 space-y-1">
                          <p className="text-gray-800 font-medium">{quote.pickupLocation.address}</p>
                          <p className="text-gray-600">
                            {quote.pickupLocation.town}, {quote.pickupLocation.district}
                          </p>
                          <p className="text-sm text-gray-500">{quote.pickupLocation.province} Province</p>
                        </div>
                      </div>

                      {/* TO Location */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                          <span className="font-semibold text-gray-900">DELIVER TO</span>
                        </div>
                        <div className="ml-7 space-y-1">
                          <p className="text-gray-800 font-medium">{quote.deliveryLocation.address}</p>
                          <p className="text-gray-600">
                            {quote.deliveryLocation.town}, {quote.deliveryLocation.district}
                          </p>
                          <p className="text-sm text-gray-500">{quote.deliveryLocation.province} Province</p>
                        </div>
                      </div>
                    </div>

                    {/* Route Summary */}
                    <div className="mt-4 bg-blue-100 rounded-lg p-3">
                      <p className="text-blue-800 font-medium text-center">
                        🚚 Route: {quote.pickupLocation.town} → {quote.deliveryLocation.town}
                        {quote.pickupLocation.district !== quote.deliveryLocation.district && 
                          ` (${quote.pickupLocation.district} → ${quote.deliveryLocation.district})`
                        }
                      </p>
                    </div>
                  </div>

                  {/* ORDER DETAILS */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order Items ({quote.orderItems.length})
                    </h4>
                    <div className="space-y-2">
                      {quote.orderItems.map((item, index) => (
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
                        <span className="text-blue-900">{formatPrice(quote.orderTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteManagement;
