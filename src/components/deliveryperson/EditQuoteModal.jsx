import React, { useState } from 'react';

const EditQuoteModal = ({ quote, onClose, onQuoteUpdated }) => {
  const [formData, setFormData] = useState({
    quotedPrice: quote?.quotedPrice?.toString() || '',
    estimatedTime: quote?.estimatedTime || '',
    validUntil: quote?.validUntil ? new Date(quote.validUntil).toISOString().slice(0, 16) : '',
    priceBreakdown: quote?.priceBreakdown || '',
    specialInstructions: quote?.specialInstructions || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!quote) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.quotedPrice || parseFloat(formData.quotedPrice) <= 0) {
      newErrors.quotedPrice = 'Please enter a valid price';
    }

    if (!formData.estimatedTime) {
      newErrors.estimatedTime = 'Please provide estimated delivery time';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Please set quote validity date';
    }

    const validUntilDate = new Date(formData.validUntil);
    if (validUntilDate <= new Date()) {
      newErrors.validUntil = 'Valid until date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedQuote = {
        ...quote,
        quotedPrice: parseFloat(formData.quotedPrice),
        estimatedTime: formData.estimatedTime,
        validUntil: formData.validUntil,
        priceBreakdown: formData.priceBreakdown,
        specialInstructions: formData.specialInstructions,
        status: 'PENDING', // Reset to pending when updated
        customerResponse: null,
        responseAt: null
      };
      
      onQuoteUpdated(updatedQuote);
      setLoading(false);
    }, 1000);
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'Rs.0.00';
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Quote</h2>
              <p className="text-gray-600">#{quote.quoteId} - Order #{quote.orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200 p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-semibold text-gray-900">{quote.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold text-gray-900">{quote.town}, {quote.district}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-xs">Delivery Address:</span>
                    <p className="font-semibold text-gray-900 mt-1">{quote.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Current Status
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      quote.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                      quote.status === 'REJECTED' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Price:</span>
                    <span className="font-bold text-green-600">{formatPrice(quote.quotedPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quote Price (Rs.) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.quotedPrice}
                  onChange={(e) => handleInputChange('quotedPrice', e.target.value)}
                  placeholder="Enter updated price"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.quotedPrice ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.quotedPrice && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.quotedPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Delivery Time *
                </label>
                <input
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                  placeholder="e.g., 2-3 hours, Same day, Next day"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.estimatedTime ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.estimatedTime && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.estimatedTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valid Until *
                </label>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => handleInputChange('validUntil', e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                    errors.validUntil ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.validUntil && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.validUntil}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Breakdown
                </label>
                <textarea
                  value={formData.priceBreakdown}
                  onChange={(e) => handleInputChange('priceBreakdown', e.target.value)}
                  placeholder="Explain your pricing breakdown"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any special handling or delivery instructions"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
                />
              </div>

              {errors.submit && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{errors.submit}</span>
                </div>
              )}

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Quote'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuoteModal;
