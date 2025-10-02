import React, { useState } from 'react';

const ServiceCard = ({ service, onBookingSuccess }) => {
  const [isBooking, setIsBooking] = useState(false);

  const handleBookService = async () => {
    try {
      setIsBooking(true);
      // You can add booking logic here
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8080/api/services/${service.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          serviceId: service.id,
          // Add other booking details as needed
        }),
      });

      if (response.ok) {
        alert('Service booked successfully!');
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      } else {
        throw new Error('Failed to book service');
      }
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to book service. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Service Image */}
      <div className="h-48 overflow-hidden">
        {service.imagePaths && service.imagePaths.length > 0 ? (
          <img
            src={`http://localhost:8080${service.imagePaths[0]}`}
            alt={service.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <div className="text-4xl text-white">🛠️</div>
          </div>
        )}
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
            <span>📍 Location: {service.district}</span>
          </div>
        )}

        {/* Service Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
        
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

        {/* Category and Price */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {service.category}
          </span>
          <span className="text-lg font-bold text-green-600">
            from {service.price}
          </span>
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
          disabled={isBooking || service.available === false}
          className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
            isBooking || service.available === false
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isBooking ? 'Booking...' : 'Book Service'}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
