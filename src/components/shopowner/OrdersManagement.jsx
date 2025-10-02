import React, { useState, useEffect } from 'react';
import shopOwnerService from '../../services/shopOwnerService';
import { useAuth } from '../../context/AuthContext';

// Toggle Button Group Component
const ToggleButtonGroup = ({ options, selected, onChange }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {options.map(({ value, label }, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`
              px-4 py-2 text-sm font-medium border focus:outline-none focus:z-10
              ${isFirst ? 'rounded-l-md' : ''} 
              ${isLast ? 'rounded-r-md' : ''} 
              ${!isFirst ? '-ml-px' : ''}
              ${selected === value 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
            `}
            aria-pressed={selected === value}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

const OrderManagement = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState({});

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('Please log in to view orders');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let ordersData;
        if (filterStatus === 'all') {
          ordersData = await shopOwnerService.getAllOrders();
        } else {
          ordersData = await shopOwnerService.getOrdersByStatus(filterStatus);
        }
        
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, filterStatus]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [orderId]: true }));
      await shopOwnerService.updateOrderStatus(orderId, newStatus);
      
      // Refresh orders after update
      const updatedOrders = await shopOwnerService.getAllOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    // Orders are now fetched in the main useEffect above
  }, []);

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price || 0).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-500';
      case 'CONFIRMED': return 'bg-green-500';
      case 'PROCESSING': return 'bg-yellow-500';
      case 'SHIPPED': return 'bg-blue-500';
      case 'DELIVERED': return 'bg-green-600';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'CONFIRMED': return '✅';
      case 'PROCESSING': return '🔄';
      case 'SHIPPED': return '�';
      case 'DELIVERED': return '✅';
      case 'CANCELLED': return '❌';
      default: return '📦';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => 
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order management...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
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
              <p className="text-gray-600">Manage and track your order history with reviews</p>
            </div>
            
            {/* Order Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </div>
                <div className="text-xs text-green-600">✅ Delivered</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">
                  {orders.filter(o => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status)).length}
                </div>
                <div className="text-xs text-blue-600">🔄 Active</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                <div className="text-2xl font-bold text-red-800">
                  {orders.filter(o => o.status === 'CANCELLED').length}
                </div>
                <div className="text-xs text-red-600">❌ Cancelled</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
                <div className="text-xs text-gray-600">📦 Total</div>
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
                placeholder="Search by order number, customer name, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <ToggleButtonGroup
                options={[
                  { value: 'all', label: 'All Orders' },
                  { value: 'PENDING', label: '⏳ Pending' },
                  { value: 'CONFIRMED', label: '✅ Confirmed' },
                  { value: 'PROCESSING', label: '🔄 Processing' },
                  { value: 'SHIPPED', label: '🚚 Shipped' },
                  { value: 'DELIVERED', label: '✅ Delivered' },
                  { value: 'CANCELLED', label: '❌ Cancelled' }
                ]}
                selected={filterStatus}
                onChange={setFilterStatus}
              />
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
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your orders will appear here once you make a purchase.'
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber || order.id}</h3>
                        <p className="text-gray-600">Customer: {order.customerName || 'N/A'}</p>
                        <p className="text-gray-600">Ordered: {formatDate(order.orderDate)}</p>
                        {order.deliveryDate && (
                          <p className="text-sm text-gray-500">
                            Delivered: {formatDateTime(order.deliveryDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold mb-2 ${getStatusColor(order.status)} flex items-center space-x-2`}>
                        <span>{getStatusIcon(order.status)}</span>
                        <span>{order.status?.replace('_', ' ')}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status Update Section for Shop Owner */}
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-3">Update Order Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                              disabled={updating[order.id]}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                              {updating[order.id] ? 'Updating...' : 'Confirm Order'}
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                              disabled={updating[order.id]}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                              {updating[order.id] ? 'Updating...' : 'Cancel Order'}
                            </button>
                          </>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                            disabled={updating[order.id]}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updating[order.id] ? 'Updating...' : 'Start Processing'}
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                            disabled={updating[order.id]}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {updating[order.id] ? 'Updating...' : 'Mark as Shipped'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Ordered Items ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={index} className="bg-white rounded border border-gray-200 p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.productName}</h5>
                              <p className="text-gray-600">Quantity: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{formatPrice(item.totalPrice)}</div>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No items found</p>
                      )}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Customer & Delivery Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium ml-2">{order.customerName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-medium ml-2">{order.customerPhone || 'N/A'}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Delivery Address:</span>
                        <span className="font-medium ml-2">{order.deliveryAddress || 'N/A'}</span>
                      </div>
                      {order.deliveryPersonName && (
                        <div>
                          <span className="text-gray-600">Delivery Person:</span>
                          <span className="font-medium ml-2">{order.deliveryPersonName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatPrice(order.subtotal || order.totalAmount)}</span>
                      </div>
                      {order.deliveryFee && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee:</span>
                          <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-green-200 font-bold text-lg">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-green-600">{formatPrice(order.totalAmount)}</span>
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

export default OrderManagement;
