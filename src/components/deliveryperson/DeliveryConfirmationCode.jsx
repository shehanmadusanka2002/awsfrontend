import React, { useState } from 'react';

const DeliveryConfirmationCode = ({ deliveryId, isVisible, onConfirmDelivery }) => {
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

      await onConfirmDelivery(confirmationData);
      
      // Reset form
      setConfirmationCode('');
      setDeliveryNotes('');
      setErrors({});
      
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Failed to confirm delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmationCode('');
    setDeliveryNotes('');
    setErrors({});
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Confirm Delivery</h3>
              <p className="text-green-100 mt-1">Complete the delivery process</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition duration-200"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Confirmation Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmation Code *
            </label>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.confirmationCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter confirmation code from customer"
            />
            {errors.confirmationCode && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmationCode}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Get this code from the customer to confirm delivery
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
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                errors.deliveryNotes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Add notes about the delivery (condition of items, customer feedback, etc.)"
            />
            {errors.deliveryNotes && (
              <p className="text-red-500 text-sm mt-1">{errors.deliveryNotes}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Describe the delivery completion and any important details
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Confirming...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Delivery
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Delivery Confirmation:</p>
                <ul className="space-y-1">
                  <li>• Ask customer for their confirmation code</li>
                  <li>• Enter the code they provide to you</li>
                  <li>• Add detailed notes about the delivery</li>
                  <li>• This will mark the delivery as completed</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryConfirmationCode;
