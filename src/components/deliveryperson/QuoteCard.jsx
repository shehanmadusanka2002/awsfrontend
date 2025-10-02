import React from 'react';

const QuoteCard = ({ quote, getStatusColor, onViewDetails, onEditQuote, onDeleteQuote }) => {
  if (!quote) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: Quote data not available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  const isExpiringSoon = () => {
    if (!quote.validUntil || quote.status !== 'PENDING') return false;
    const now = new Date();
    const expiry = new Date(quote.validUntil);
    const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
  };

  const isExpired = () => {
    if (!quote.validUntil) return false;
    return new Date() > new Date(quote.validUntil) && quote.status === 'PENDING';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ACCEPTED':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'REJECTED':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'EXPIRED':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
      {/* Expiring Soon Alert */}
      {isExpiringSoon() && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Expiring Soon!</span>
          </div>
        </div>
      )}

      {/* Expired Alert */}
      {isExpired() && (
        <div className="bg-gray-600 text-white px-4 py-2 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Quote Expired</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Quote #{quote.quoteId || 'N/A'}</h3>
              <p className="text-sm text-gray-500">Order #{quote.orderId || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`${getStatusColor(quote.status)} text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-sm`}>
              {getStatusIcon(quote.status)}
              <span>{quote.status}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{formatPrice(quote.quotedPrice)}</div>
              <div className="text-xs text-gray-500">Quote Amount</div>
            </div>
          </div>
        </div>

        {/* Customer & Location Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-gray-900">Customer</span>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{quote.customerName || 'N/A'}</p>
              <p className="text-sm text-gray-600">{quote.customerPhone || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-gray-900">Location</span>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{quote.town || 'N/A'}, {quote.district || 'N/A'}</p>
              <p className="text-sm text-gray-600">ETA: {quote.estimatedTime || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">Created</div>
              <div className="text-gray-600">{formatDate(quote.createdAt)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Valid Until</div>
              <div className={`${isExpiringSoon() ? 'text-orange-600 font-bold' : 'text-gray-600'}`}>
                {formatDate(quote.validUntil)}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Response</div>
              <div className="text-gray-600">
                {quote.responseAt ? formatDate(quote.responseAt) : 'Waiting...'}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Response */}
        {quote.customerResponse && (
          <div className={`rounded-lg p-4 mb-4 border-l-4 ${
            quote.status === 'ACCEPTED' 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-start space-x-2">
              <svg className={`h-5 w-5 mt-0.5 ${
                quote.status === 'ACCEPTED' ? 'text-green-600' : 'text-red-600'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Customer Response:</p>
                <p className="text-sm text-gray-700 mt-1">{quote.customerResponse}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => onViewDetails(quote)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>

          {(quote.status === 'PENDING' || quote.status === 'REJECTED') && (
            <button
              onClick={() => onEditQuote(quote)}
              className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Quote
            </button>
          )}

          <button
            onClick={() => onDeleteQuote(quote.id)}
            className="border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
