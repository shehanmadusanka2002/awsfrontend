import React from 'react';

const DeliveryRequestCard = ({ request, onCreateQuote, getStatusColor }) => {
  // Safety check - return early if no request
  if (!request) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-medium">Error: Request data not available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'Rs.0.00';
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Safe request data with defaults
  const safeRequest = {
    id: request.id || Math.random(),
    orderId: request.orderId || 'N/A',
    requestedAt: request.requestedAt || '',
    status: request.status || 'UNKNOWN',
    customerName: request.customerName || 'Unknown Customer',
    customerPhone: request.customerPhone || 'N/A',
    customerEmail: request.customerEmail || 'N/A',
    district: request.district || 'N/A',
    town: request.town || 'N/A',
    estimatedDistance: request.estimatedDistance || 0,
    deliveryAddress: request.deliveryAddress || 'Address not provided',
    totalItems: request.totalItems || 0,
    totalWeight: request.totalWeight || 0,
    orderValue: request.orderValue || 0,
    hasLivefish: request.hasLivefish || false,
    specialInstructions: request.specialInstructions || '',
    proposedPrice: request.proposedPrice || null,
    quotedAt: request.quotedAt || null
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending Quote';
      case 'QUOTED': return 'Quote Sent';
      case 'ACCEPTED': return 'Accepted';
      case 'IN_TRANSIT': return 'In Transit';
      case 'DELIVERED': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Order #{safeRequest.orderId}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Requested {formatDate(safeRequest.requestedAt)}
              </p>
            </div>
          </div>
          <div className={`${getStatusColor(safeRequest.status)} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm`}>
            {getStatusText(safeRequest.status)}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Customer Info */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-semibold text-gray-900">Customer Information</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold text-gray-900">{safeRequest.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Phone:</span>
              <a href={`tel:${safeRequest.customerPhone}`} className="font-semibold text-blue-600 hover:text-blue-800">
                {safeRequest.customerPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Delivery Location */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-gray-900">Delivery Location</span>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 rounded-r-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">District:</span>
                <span className="font-semibold text-gray-900">{safeRequest.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Town:</span>
                <span className="font-semibold text-gray-900">{safeRequest.town}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-semibold text-green-700">{safeRequest.estimatedDistance} km</span>
              </div>
            </div>
            <div className="pt-2 border-t border-green-200">
              <span className="text-gray-600 text-sm font-medium">Full Address:</span>
              <p className="mt-1 text-gray-800 font-medium">{safeRequest.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-semibold text-gray-900">Order Details</span>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 rounded-r-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-800 text-lg">{safeRequest.totalItems}</div>
                <div className="text-gray-600">Items</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-800 text-lg">{safeRequest.totalWeight} kg</div>
                <div className="text-gray-600">Weight</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-800 text-lg">{formatPrice(safeRequest.orderValue)}</div>
                <div className="text-gray-600">Order Value</div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-lg ${safeRequest.hasLivefish ? 'text-orange-600' : 'text-green-600'}`}>
                  {safeRequest.hasLivefish ? 'LIVE' : 'STD'}
                </div>
                <div className="text-gray-600">Type</div>
              </div>
            </div>
            {safeRequest.specialInstructions && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex items-start space-x-2">
                  <svg className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-gray-600 text-sm font-medium">Special Instructions:</span>
                    <p className="text-sm text-gray-800 font-medium mt-1">{safeRequest.specialInstructions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Quote */}
        {safeRequest.proposedPrice && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-semibold text-gray-900">Your Quote</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-800">
                  {formatPrice(safeRequest.proposedPrice)}
                </div>
                <div className="text-xs text-gray-600">
                  Quoted {formatDate(safeRequest.quotedAt)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
          {safeRequest.status === 'PENDING' && (
            <button 
              onClick={() => onCreateQuote(request)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-sm"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Create Quote
            </button>
          )}
          
          {safeRequest.status === 'QUOTED' && (
            <button 
              onClick={() => onCreateQuote(request)}
              className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Update Quote
            </button>
          )}

          {safeRequest.status === 'ACCEPTED' && (
            <>
              <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                Start Delivery
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition duration-200">
                Contact Customer
              </button>
            </>
          )}

          <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRequestCard;
