import React, { useState, useEffect } from 'react';
import deliveryService from '../../services/deliveryService';
import { useAuth } from '../../context/AuthContext';

const CurrentDeliveries = () => {
  const { user, token } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState({});

  // Fetch current deliveries from backend
  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!token) {
        setError('Please log in to view current deliveries');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const deliveriesData = await deliveryService.getCurrentDeliveries();
        setDeliveries(deliveriesData);
      } catch (err) {
        console.error('Error fetching current deliveries:', err);
        setError('Failed to load current deliveries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [token]);

  // Mock current deliveries data - WITH PAYMENT INFO
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
      deliveryFee: 1200,
      totalPayment: 7200, // orderTotal + deliveryFee
      paymentMethod: 'Cash on Delivery',
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
      status: 'PICKED_UP',
      startTime: '2025-09-03T09:30:00',
      specialInstructions: 'Handle live fish carefully',
      confirmationCode: null,
      customerSignature: null,
      deliveryNotes: null,
      completedAt: null
    },
    {
      id: 2,
      orderId: 'ORD002',
      quoteId: 'QT002',
      customerName: 'Kamal Silva',
      customerPhone: '0779876543',
      orderItems: [
        { name: 'Fish Food Premium', quantity: 2, price: 750 },
        { name: 'Water Conditioner', quantity: 1, price: 1200 }
      ],
      orderTotal: 2700,
      deliveryFee: 1500,
      totalPayment: 4200, // orderTotal + deliveryFee
      paymentMethod: 'Paid',
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
      status: 'IN_TRANSIT',
      startTime: '2025-09-03T08:00:00',
      specialInstructions: 'Call before arrival',
      confirmationCode: null,
      customerSignature: null,
      deliveryNotes: null,
      completedAt: null
    },
    {
      id: 3,
      orderId: 'ORD003',
      quoteId: 'QT003',
      customerName: 'Nimal Fernando',
      customerPhone: '0712345678',
      orderItems: [
        { name: 'Large Aquarium Tank (50L)', quantity: 1, price: 15000 },
        { name: 'Aquarium Stand Wooden', quantity: 1, price: 8000 }
      ],
      orderTotal: 23000,
      deliveryFee: 2200,
      totalPayment: 25200, // orderTotal + deliveryFee
      paymentMethod: 'Cash on Delivery',
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
      status: 'ARRIVED',
      startTime: '2025-09-03T07:00:00',
      specialInstructions: 'Large tank - need assistance unloading',
      confirmationCode: null,
      customerSignature: null,
      deliveryNotes: null,
      completedAt: null
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-500';
      case 'PICKED_UP': return 'bg-yellow-500';
      case 'IN_TRANSIT': return 'bg-purple-500';
      case 'ARRIVED': return 'bg-orange-500';
      case 'DELIVERED': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'border-blue-300';
      case 'PICKED_UP': return 'border-yellow-300';
      case 'IN_TRANSIT': return 'border-purple-300';
      case 'ARRIVED': return 'border-orange-300';
      case 'DELIVERED': return 'border-green-300';
      default: return 'border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'Ready to Pick';
      case 'PICKED_UP': return 'Picked Up';
      case 'IN_TRANSIT': return 'In Transit';
      case 'ARRIVED': return 'Arrived';
      case 'DELIVERED': return 'Delivered';
      default: return status;
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cash on Delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              status: newStatus,
              startTime: newStatus === 'PICKED_UP' && !delivery.startTime 
                ? new Date().toISOString() 
                : delivery.startTime
            }
          : delivery
      )
    );
  };

  const handleDeliveryConfirmation = async (deliveryId, confirmationData) => {
    try {
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(delivery =>
          delivery.id === deliveryId
            ? {
                ...delivery,
                status: 'DELIVERED',
                confirmationCode: confirmationData.confirmationCode,
                deliveryNotes: confirmationData.deliveryNotes,
                completedAt: confirmationData.timestamp
              }
            : delivery
        )
      );

      setShowConfirmation(prev => ({ ...prev, [deliveryId]: false }));
      alert('Delivery confirmed successfully!');
      
    } catch (error) {
      console.error('Error confirming delivery:', error);
      throw error;
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'ASSIGNED': return { action: 'PICKED_UP', label: 'Mark as Picked Up', color: 'bg-blue-600' };
      case 'PICKED_UP': return { action: 'IN_TRANSIT', label: 'Start Delivery', color: 'bg-yellow-600' };
      case 'IN_TRANSIT': return { action: 'ARRIVED', label: 'Mark as Arrived', color: 'bg-purple-600' };
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading current deliveries...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Current Deliveries</h1>
              <p className="text-gray-600">Track and manage your active delivery orders</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-800">
                  {deliveries.filter(d => d.status === 'PICKED_UP').length}
                </div>
                <div className="text-xs text-yellow-600">Picked Up</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-200">
                <div className="text-2xl font-bold text-purple-800">
                  {deliveries.filter(d => d.status === 'IN_TRANSIT').length}
                </div>
                <div className="text-xs text-purple-600">In Transit</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center border border-orange-200">
                <div className="text-2xl font-bold text-orange-800">
                  {deliveries.filter(d => d.status === 'ARRIVED').length}
                </div>
                <div className="text-xs text-orange-600">Arrived</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{deliveries.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Deliveries */}
        <div className="space-y-4">
          {deliveries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Deliveries</h3>
              <p className="text-gray-600">You don't have any deliveries in progress right now.</p>
            </div>
          ) : (
            deliveries.map(delivery => (
              <div key={delivery.id} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${getBorderColor(delivery.status)}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order #{delivery.orderId}</h3>
                        <p className="text-gray-600">Quote #{delivery.quoteId}</p>
                        <p className="text-gray-600">{delivery.customerName}</p>
                        <p className="text-sm text-gray-500">
                          Started: {formatDateTime(delivery.startTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold mb-2 ${getStatusColor(delivery.status)} flex items-center space-x-2`}>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>{getStatusText(delivery.status)}</span>
                      </div>
                      {/* TOTAL PAYMENT DISPLAY */}
                      <div className="text-3xl font-bold text-blue-600">{formatPrice(delivery.totalPayment)}</div>
                      <div className="text-sm text-gray-500">Total Payment</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Delivery: {formatPrice(delivery.deliveryFee)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* PAYMENT INFORMATION */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Payment Information
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">Order Total</p>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(delivery.orderTotal)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">Delivery Fee</p>
                        <p className="text-xl font-bold text-green-600">{formatPrice(delivery.deliveryFee)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">Total Payment</p>
                        <p className="text-xl font-bold text-blue-600">{formatPrice(delivery.totalPayment)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentMethodColor(delivery.paymentMethod)}`}>
                        {delivery.paymentMethod}
                      </span>
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
                          <p className="text-gray-800 font-medium">{delivery.pickupLocation.address}</p>
                          <p className="text-gray-600">
                            {delivery.pickupLocation.town}, {delivery.pickupLocation.district}
                          </p>
                          <p className="text-sm text-gray-500">{delivery.pickupLocation.province} Province</p>
                        </div>
                      </div>

                      {/* TO Location */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                          <span className="font-semibold text-gray-900">DELIVER TO</span>
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

                    {/* Route Summary */}
                    <div className="mt-4 bg-blue-100 rounded-lg p-3">
                      <p className="text-blue-800 font-medium text-center">
                        🚚 Route: {delivery.pickupLocation.town} → {delivery.deliveryLocation.town}
                        {delivery.pickupLocation.district !== delivery.deliveryLocation.district && 
                          ` (${delivery.pickupLocation.district} → ${delivery.deliveryLocation.district})`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{delivery.customerName}</p>
                      <p className="text-gray-600 flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-blue-600">{delivery.customerPhone}</span>
                      </p>
                    </div>
                  </div>

                  {/* ORDER DETAILS */}
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

                  {/* Special Instructions */}
                  {delivery.specialInstructions && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Special Instructions
                      </h4>
                      <p className="text-gray-800">{delivery.specialInstructions}</p>
                    </div>
                  )}

                  {/* INLINE DELIVERY CONFIRMATION FORM - ONLY FOR ARRIVED STATUS */}
                  {delivery.status === 'ARRIVED' && showConfirmation[delivery.id] && (
                    <InlineDeliveryConfirmation 
                      delivery={delivery}
                      onConfirmDelivery={handleDeliveryConfirmation}
                      onCancel={() => setShowConfirmation(prev => ({ ...prev, [delivery.id]: false }))}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                    {getNextAction(delivery.status) && (
                      <button
                        onClick={() => updateDeliveryStatus(delivery.id, getNextAction(delivery.status).action)}
                        className={`${getNextAction(delivery.status).color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center`}
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {getNextAction(delivery.status).label}
                      </button>
                    )}

                    {delivery.status === 'ARRIVED' && !showConfirmation[delivery.id] && (
                      <button
                        onClick={() => setShowConfirmation(prev => ({ ...prev, [delivery.id]: true }))}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirm Delivery
                      </button>
                    )}

                    {/* Only View on Map Button */}
                    <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition duration-200">
                      View on Map
                    </button>
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

// INLINE DELIVERY CONFIRMATION COMPONENT (same as before)
const InlineDeliveryConfirmation = ({ delivery, onConfirmDelivery, onCancel }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!confirmationCode.trim()) {
      newErrors.confirmationCode = 'Confirmation code is required';
    } else if (confirmationCode.trim().length < 3) {
      newErrors.confirmationCode = 'Confirmation code must be at least 3 characters';
    }

    if (!deliveryNotes.trim()) {
      newErrors.deliveryNotes = 'Delivery notes are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const confirmationData = {
        confirmationCode: confirmationCode.trim(),
        deliveryNotes: deliveryNotes.trim(),
        timestamp: new Date().toISOString()
      };

      await onConfirmDelivery(delivery.id, confirmationData);
      
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Failed to confirm delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Delivery Confirmation
        </h4>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Confirmation Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmation Code *
          </label>
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.confirmationCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter confirmation code from customer"
            disabled={isSubmitting}
          />
          {errors.confirmationCode && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmationCode}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Ask the customer for their confirmation code
          </p>
        </div>

        {/* Delivery Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes *
          </label>
          <textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
              errors.deliveryNotes ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Add notes about the delivery completion..."
            disabled={isSubmitting}
          />
          {errors.deliveryNotes && (
            <p className="text-red-500 text-sm mt-1">{errors.deliveryNotes}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Describe delivery completion and item condition
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirming...
              </>
            ) : (
              'Confirm Delivery'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CurrentDeliveries;
