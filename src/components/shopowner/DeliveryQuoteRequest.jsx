import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import deliveryService from '../../services/deliveryService';

const EnhancedDeliveryRequest = () => {
  const { user } = useContext(AuthContext);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeQuoteRequest = async () => {
      try {
        // Get order data from localStorage
        const savedOrder = JSON.parse(localStorage.getItem('aqualink_order_data') || 'null');
        
        if (!savedOrder) {
          alert('No order data found. Please start from cart.');
          window.location.href = '/cart';
          return;
        }

        if (savedOrder.status !== 'REQUESTING_QUOTES') {
          alert('Invalid order status. Please start from cart.');
          window.location.href = '/cart';
          return;
        }

        console.log('Order data loaded:', savedOrder);
        setOrderData(savedOrder);

        // Instead of selecting specific delivery persons, we'll create a quote request
        // that all delivery partners can see and respond to
        setLoading(false);

      } catch (error) {
        console.error('Error initializing quote request:', error);
        setError('Failed to load delivery partners. Please try again.');
        setLoading(false);
      }
    };

    initializeQuoteRequest();
  }, []);

  const sendQuoteRequests = async () => {
    setSending(true);
    setError(null);

    try {
      // Create delivery quote request using the backend API
      const quoteRequestData = {
        customerName: user?.name || 'Customer',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || 'Phone not specified',
        deliveryAddress: orderData.deliveryAddress || 'Address not specified',
        orderItems: orderData.items.map(item => ({
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: orderData.subtotal,
        specialInstructions: orderData.preferences?.specialInstructions || 'No special instructions',
        urgencyLevel: orderData.preferences?.urgencyLevel || 'NORMAL',
        preferredDeliveryTime: orderData.preferences?.preferredTime || new Date().toISOString(),
        quotesExpireAfter: orderData.preferences?.quotesExpireAfter || 24
      };

      console.log('Sending quote request:', quoteRequestData);
      
      const response = await deliveryService.createQuoteRequest(quoteRequestData);
      
      if (response.success) {
        // Update order data with the backend session ID
        const updatedOrderData = {
          ...orderData,
          sessionId: response.data.sessionId,
          requestSentAt: new Date().toISOString(),
          status: 'QUOTES_REQUESTED'
        };

        localStorage.setItem('aqualink_order_data', JSON.stringify(updatedOrderData));

        alert(`Quote request created successfully! Session ID: ${response.data.sessionId}\nDelivery partners will now be able to see your request and provide quotes.`);
        
        // Small delay to let user see the success message, then redirect
        setTimeout(() => {
          // Redirect to quote acceptance page where customer can view incoming quotes
          window.location.href = '/quote-acceptance';
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create quote request');
      }

    } catch (error) {
      console.error('Error sending quote requests:', error);
      setError(error.message || 'Failed to send quote requests. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery partners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Page</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Delivery Quotes</h1>
          <p className="text-gray-600">Select delivery partners to send quote requests for your order</p>
        </div>

        {/* Order Information Display - UPDATED: Date section removed */}
        {orderData?.preferences && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-3">Order Information</h2>
            <div className="max-w-md">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-blue-600 font-semibold mb-1">⏰ Quote Response Time</div>
                <div className="text-gray-900 text-lg font-semibold">
                  {orderData.preferences.quotesExpireAfter} hour{orderData.preferences.quotesExpireAfter > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Items:</h3>
            <div className="space-y-2">
              {orderData?.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-700">{item.name} x {item.quantity}</span>
                  <span className="font-semibold text-gray-900">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Subtotal:</span>
                <span className="font-bold text-lg text-blue-600">Rs.{orderData?.subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Request Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create Delivery Quote Request</h2>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <svg className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Your quote request will be published to all available delivery partners</li>
                  <li>• Delivery partners will review your order and submit competitive quotes</li>
                  <li>• You'll receive quotes within {orderData?.preferences?.quotesExpireAfter || 24} hour{(orderData?.preferences?.quotesExpireAfter || 24) > 1 ? 's' : ''}</li>
                  <li>• You can then compare and select the best quote for your delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Send Requests Button */}
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <button 
              onClick={sendQuoteRequests}
              disabled={sending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full"
            >
              {sending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Quote Request...
                </div>
              ) : (
                `Create Delivery Quote Request`
              )}
            </button>

            {/* Alternative navigation button */}
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-2">Or if you already have a quote request pending:</div>
              <button 
                onClick={() => window.location.href = '/quote-acceptance'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
              >
                View Pending Quotes
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-3">
            Your quote request will be published to all available delivery partners
          </p>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800 text-sm font-medium">
              📋 Ready to create quote request for your order
            </div>
            <div className="text-green-700 text-xs mt-1">
              Delivery partners will have {orderData?.preferences?.quotesExpireAfter || 24} hour{(orderData?.preferences?.quotesExpireAfter || 24) > 1 ? 's' : ''} to respond with quotes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDeliveryRequest;
