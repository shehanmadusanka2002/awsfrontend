import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = () => {
      try {
        // Try to find the order in localStorage
        const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
        const foundOrder = existingOrders.find(order => order.orderId === orderId);
        
        if (foundOrder) {
          setOrderDetails(foundOrder);
        } else {
          // If not found in localStorage, create a placeholder order
          setOrderDetails({
            orderId: orderId,
            status: 'CONFIRMED',
            orderDate: new Date().toISOString(),
            message: 'Order details not found in local storage, but order has been confirmed.'
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading order details:', error);
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="text-green-500 text-8xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Your delivery order has been successfully placed</p>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 font-semibold text-lg">Order ID: {orderId}</div>
            <div className="text-green-700 text-sm mt-1">
              Keep this order ID for tracking your delivery
            </div>
          </div>
        </div>

        {orderDetails && orderDetails.items && (
          <>
            {/* Order Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Items Ordered:</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700">{item.name} × {item.quantity}</span>
                        <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Summary:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">{formatPrice(orderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-semibold">{formatPrice(orderDetails.deliveryFee)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">{formatPrice(orderDetails.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {orderDetails.deliveryPartner && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Delivery Partner:</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-semibold text-blue-900">{orderDetails.deliveryPartner.name}</div>
                      <div className="text-blue-800 text-sm mt-1">
                        ⭐ {orderDetails.deliveryPartner.rating} rating • {orderDetails.deliveryPartner.completedDeliveries} deliveries
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payment & Delivery:</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-semibold">{orderDetails.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-semibold">{formatDate(orderDetails.orderDate)}</span>
                      </div>
                      {orderDetails.deliveryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Date:</span>
                          <span className="font-semibold text-green-700">{formatDate(orderDetails.deliveryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Next Steps */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What happens next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 text-4xl mb-2">📋</div>
              <div className="font-semibold text-blue-900">Order Processing</div>
              <div className="text-blue-800 text-sm mt-1">Your order is being prepared by the seller</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 text-4xl mb-2">🚚</div>
              <div className="font-semibold text-yellow-900">Pickup</div>
              <div className="text-yellow-800 text-sm mt-1">Delivery partner will collect your order</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 text-4xl mb-2">📦</div>
              <div className="font-semibold text-green-900">Delivery</div>
              <div className="text-green-800 text-sm mt-1">Your order will be delivered to you</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-sm text-center space-y-4">
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/cart'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => window.location.href = '/orders'}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              View My Orders
            </button>
          </div>
          
          <div className="text-gray-600 text-sm">
            Need help? Contact our support team with order ID: <strong>{orderId}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;