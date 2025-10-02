import React, { useState, useEffect } from 'react';

const FarmOwnerOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  // Mock orders data for farm owner
  const mockOrders = [
    {
      id: 1,
      orderId: 'ORD001',
      orderDate: '2025-09-08T10:30:00',
      status: 'CONFIRMED',
      customerInfo: {
        name: 'Saman Perera',
        email: 'saman@email.com',
        phone: '0771234567',
        address: '123 Main Street, Dehiwala',
        city: 'Dehiwala',
        district: 'Colombo'
      },
      products: [
        {
          id: 1,
          name: 'Gold Fish (Medium)',
          quantity: 5,
          unitPrice: 500,
          totalPrice: 2500
        },
        {
          id: 2,
          name: 'Aquarium Filter (External)',
          quantity: 1,
          unitPrice: 3500,
          totalPrice: 3500
        }
      ],
      orderTotal: 6000,
      deliveryFee: 1200,
      totalAmount: 7200,
      paymentMethod: 'Cash on Delivery',
      deliveryInfo: {
        preferredDate: '2025-09-10',
        contactPerson: 'Saman Perera',
        alternatePhone: '0112345678'
      },
      farmNotes: '',
      lastUpdated: '2025-09-08T10:30:00'
    },
    {
      id: 2,
      orderId: 'ORD002',
      orderDate: '2025-09-07T15:45:00',
      status: 'PROCESSING',
      customerInfo: {
        name: 'Kamal Silva',
        email: 'kamal.silva@email.com',
        phone: '0779876543',
        address: '456 Beach Road, Negombo',
        city: 'Negombo',
        district: 'Gampaha'
      },
      products: [
        {
          id: 3,
          name: 'Koi Fish (Large)',
          quantity: 2,
          unitPrice: 2500,
          totalPrice: 5000
        },
        {
          id: 4,
          name: 'Fish Food Premium (1kg)',
          quantity: 3,
          unitPrice: 750,
          totalPrice: 2250
        }
      ],
      orderTotal: 7250,
      deliveryFee: 1500,
      totalAmount: 8750,
      paymentMethod: 'Paid',
      deliveryInfo: {
        preferredDate: '2025-09-11',
        contactPerson: 'Kamal Silva',
        alternatePhone: null
      },
      farmNotes: 'Selected best breeding pair from pond #3. Both fish are healthy and active.',
      lastUpdated: '2025-09-08T09:15:00'
    },
    {
      id: 3,
      orderId: 'ORD003',
      orderDate: '2025-09-06T12:20:00',
      status: 'SHIPPED',
      customerInfo: {
        name: 'Priya Jayawardena',
        email: 'priya.j@email.com',
        phone: '0712345678',
        address: '789 Temple Road, Kandy',
        city: 'Kandy',
        district: 'Kandy'
      },
      products: [
        {
          id: 5,
          name: 'Angel Fish (Pair)',
          quantity: 1,
          unitPrice: 1200,
          totalPrice: 1200
        },
        {
          id: 6,
          name: 'Aquarium Plants Set',
          quantity: 1,
          unitPrice: 800,
          totalPrice: 800
        }
      ],
      orderTotal: 2000,
      deliveryFee: 2200,
      totalAmount: 4200,
      paymentMethod: 'Cash on Delivery',
      deliveryInfo: {
        preferredDate: '2025-09-09',
        contactPerson: 'Priya Jayawardena',
        alternatePhone: '0812345678'
      },
      farmNotes: 'Fish packed with extra oxygen. Delivery person instructed on fish handling.',
      trackingInfo: {
        deliveryPartner: 'Express Delivery Co.',
        trackingNumber: 'EXP123456789',
        estimatedDelivery: '2025-09-08T16:00:00',
        currentStatus: 'In Transit'
      },
      lastUpdated: '2025-09-07T08:30:00'
    },
    {
      id: 4,
      orderId: 'ORD004',
      orderDate: '2025-09-08T16:10:00',
      status: 'CONFIRMED',
      customerInfo: {
        name: 'Nimal Fernando',
        email: 'nimal.fernando@email.com',
        phone: '0765432109',
        address: '321 Lake View, Kurunegala',
        city: 'Kurunegala',
        district: 'Kurunegala'
      },
      products: [
        {
          id: 7,
          name: 'Guppy Fish (Mixed Colors)',
          quantity: 10,
          unitPrice: 150,
          totalPrice: 1500
        },
        {
          id: 8,
          name: 'Small Aquarium Tank (20L)',
          quantity: 1,
          unitPrice: 2500,
          totalPrice: 2500
        }
      ],
      orderTotal: 4000,
      deliveryFee: 1800,
      totalAmount: 5800,
      paymentMethod: 'Cash on Delivery',
      deliveryInfo: {
        preferredDate: '2025-09-12',
        contactPerson: 'Nimal Fernando',
        alternatePhone: null
      },
      farmNotes: '',
      lastUpdated: '2025-09-08T16:10:00'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
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
      case 'CONFIRMED': return 'bg-blue-500';
      case 'PROCESSING': return 'bg-yellow-500';
      case 'SHIPPED': return 'bg-green-500';
      case 'DELIVERED': return 'bg-emerald-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return '✅';
      case 'PROCESSING': return '🔄';
      case 'SHIPPED': return '🚚';
      case 'DELIVERED': return '📦';
      case 'CANCELLED': return '❌';
      default: return '📋';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'CONFIRMED': return 'PROCESSING';
      case 'PROCESSING': return 'SHIPPED';
      case 'SHIPPED': return 'DELIVERED';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus) => {
    switch (currentStatus) {
      case 'CONFIRMED': return 'Start Processing';
      case 'PROCESSING': return 'Mark as Shipped';
      case 'SHIPPED': return 'Mark as Delivered';
      default: return null;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                lastUpdated: new Date().toISOString()
              }
            : order
        )
      );

      alert(`Order #${orders.find(o => o.id === orderId)?.orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const updateFarmNotes = (orderId, notes) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, farmNotes: notes }
          : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">Manage incoming orders and coordinate deliveries</p>
            </div>
            
            {/* Order Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">
                  {orders.filter(o => o.status === 'CONFIRMED').length}
                </div>
                <div className="text-xs text-blue-600">✅ New Orders</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-800">
                  {orders.filter(o => o.status === 'PROCESSING').length}
                </div>
                <div className="text-xs text-yellow-600">🔄 Processing</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {orders.filter(o => o.status === 'SHIPPED').length}
                </div>
                <div className="text-xs text-green-600">🚚 Shipped</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
                <div className="text-xs text-gray-600">📋 Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by order ID, customer name, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="CONFIRMED">✅ New Orders</option>
                <option value="PROCESSING">🔄 Processing</option>
                <option value="SHIPPED">🚚 Shipped</option>
                <option value="DELIVERED">📦 Delivered</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'New orders will appear here.'
                }
              </p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order #{order.orderId}</h3>
                        <p className="text-gray-600">{order.customerInfo.name}</p>
                        <p className="text-sm text-gray-500">
                          Ordered: {formatDateTime(order.orderDate)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Updated: {formatDateTime(order.lastUpdated)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold mb-2 ${getStatusColor(order.status)} flex items-center space-x-2`}>
                        <span>{getStatusIcon(order.status)}</span>
                        <span>{order.status}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {order.customerInfo.name}</p>
                        <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                        <p><strong>Address:</strong> {order.customerInfo.address}</p>
                        <p><strong>City:</strong> {order.customerInfo.city}</p>
                        <p><strong>District:</strong> {order.customerInfo.district}</p>
                      </div>
                    </div>

                    {/* Delivery Information - EDITED */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Delivery Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Preferred Date:</strong> {formatDate(order.deliveryInfo.preferredDate)}</p>
                        <p><strong>Contact Person:</strong> {order.deliveryInfo.contactPerson}</p>
                        {order.deliveryInfo.alternatePhone && (
                          <p><strong>Alt. Phone:</strong> {order.deliveryInfo.alternatePhone}</p>
                        )}
                        <p><strong>Payment:</strong> <span className={`px-2 py-1 rounded text-xs ${order.paymentMethod === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{order.paymentMethod}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Products Ordered */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Products Ordered ({order.products.length})</h4>
                    <div className="space-y-3">
                      {order.products.map((product, index) => (
                        <div key={index} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{product.name}</h5>
                              <p className="text-gray-600 text-sm">Quantity: {product.quantity} × {formatPrice(product.unitPrice)}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{formatPrice(product.totalPrice)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Farm Notes */}
                  <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Farm Notes</h4>
                    <textarea
                      value={order.farmNotes}
                      onChange={(e) => updateFarmNotes(order.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                      placeholder="Add notes about fish selection, preparation, special handling, etc..."
                    />
                  </div>

                  {/* Tracking Information (for shipped orders) */}
                  {order.status === 'SHIPPED' && order.trackingInfo && (
                    <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">Tracking Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Delivery Partner:</strong> {order.trackingInfo.deliveryPartner}</p>
                          <p><strong>Tracking Number:</strong> {order.trackingInfo.trackingNumber}</p>
                        </div>
                        <div>
                          <p><strong>Current Status:</strong> {order.trackingInfo.currentStatus}</p>
                          <p><strong>Estimated Delivery:</strong> {formatDateTime(order.trackingInfo.estimatedDelivery)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Total:</span>
                        <span className="font-medium">{formatPrice(order.orderTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee:</span>
                        <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-blue-600">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - ONLY Status Update Button */}
                  <div className="mt-6">
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                        disabled={updatingStatus[order.id]}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {updatingStatus[order.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {getNextStatusLabel(order.status)}
                          </>
                        )}
                      </button>
                    )}
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

export default FarmOwnerOrderManagement;
