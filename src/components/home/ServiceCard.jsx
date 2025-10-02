import React, { useState } from 'react';

const ServiceCard = ({ service, onBookingSuccess }) => {

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleBookService = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book services');
      return;
    }
    setShowBookingModal(true);
  };

  const formatPrice = (price, maxPrice) => {
    if (maxPrice && maxPrice > price) {
      return `LKR ${price} - LKR ${maxPrice}`;
    }
    return `from LKR ${price}`;
  };

  const getImageUrl = (imagePath) => {
    console.log("Image path received:", imagePath);

    if (!imagePath) {
      // Use a data URL for a placeholder image (gray square)
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    if (imagePath.startsWith('/uploads/')) {
      const fullUrl = `http://localhost:8080${imagePath}`;
      console.log("Constructed URL:", fullUrl);
      return fullUrl;
    }

    const fullUrl = `http://localhost:8080/uploads/${imagePath}`;
    console.log("Constructed URL (fallback):", fullUrl);
    return fullUrl;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    setImageLoading(false);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Service Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}
          <img
            src={getImageUrl(service.imagePaths?.[0])}
            alt={service.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>

        <div className="p-6">
          {/* Service Name */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>

          {/* Location */}
          {service.district && (
            <div className="mb-2 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{service.district}</span>
            </div>
          )}
          
          {/* Review Rate Section */}
          <div className="flex items-center mb-3">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={i < Math.floor(service.reviewRate || 0) ? "text-yellow-400" : "text-gray-300"}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {service.reviewRate ? service.reviewRate.toFixed(1) : '0.0'} 
              <span className="text-gray-400 ml-1">
                ({service.reviewCount || 0} reviews)
              </span>
            </span>
          </div>

          {/* Category, Duration, Location */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {service.category}
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatPrice(service.price, service.maxPrice)}
              </span>
            </div>
            
            {service.duration && (
              <div className="text-sm text-gray-600">
                ⏱️ Duration: {service.duration}
              </div>
            )}
            
          </div>

          {/* Availability Status */}
          <div className="mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${
              service.available !== false 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {service.available !== false ? 'Available' : 'Unavailable'}
            </span>
          </div>

          {/* Book Service Button */}
          <button
            onClick={handleBookService}
            disabled={service.available === false}
            className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
              service.available === false
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Book Service
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => {
            setShowBookingModal(false);
            if (onBookingSuccess) onBookingSuccess();
          }}
        />
      )}
    </>
  );
};

// Booking Modal Component
const BookingModal = ({ service, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    customerRequirements: '',
    preferredDate: '',
    preferredTime: '',
    customerLocation: '',
    customerPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/services/${service.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          preferredDate: new Date(formData.preferredDate).toISOString()
        })
      });

      if (response.ok) {
        alert('Service booked successfully! The service provider will contact you soon.');
        onBookingSuccess();
      } else {
        throw new Error('Failed to book service');
      }
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to book service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Book {service.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements *
            </label>
            <textarea
              value={formData.customerRequirements}
              onChange={(e) => setFormData({...formData, customerRequirements: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
              required
              placeholder="Describe what you need..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date *
            </label>
            <input
              type="datetime-local"
              value={formData.preferredDate}
              onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              value={formData.customerLocation}
              onChange={(e) => setFormData({...formData, customerLocation: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
              placeholder="Service location address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
              placeholder="Your contact number"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
            >
              {isSubmitting ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceCard;
