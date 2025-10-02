import React, { useState, useEffect } from 'react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/services/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBookings(data.content || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Service Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500">You haven't booked any services yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <CustomerBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerBookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'PENDING': return 'Waiting for service provider to confirm';
      case 'CONFIRMED': return 'Service confirmed! Provider will contact you soon';
      case 'IN_PROGRESS': return 'Service is currently being provided';
      case 'COMPLETED': return 'Service completed successfully';
      case 'CANCELLED': return 'Service was cancelled';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{booking.service?.name}</h3>
          <p className="text-sm text-gray-600">Booking #{booking.id}</p>
          <p className="text-sm text-gray-500">
            Booked on {new Date(booking.bookedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
          <p className="text-sm text-gray-600 mt-1">{getStatusMessage(booking.status)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div><span className="font-medium">Preferred Date:</span> {new Date(booking.preferredDate).toLocaleString()}</div>
            <div><span className="font-medium">Location:</span> {booking.customerLocation}</div>
            <div><span className="font-medium">Phone:</span> {booking.customerPhone}</div>
            {booking.quotedPrice && (
              <div><span className="font-medium">Quoted Price:</span> ${booking.quotedPrice}</div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
          <p className="text-sm text-gray-600">{booking.customerRequirements}</p>
          
          {booking.providerNotes && (
            <div className="mt-3">
              <h4 className="font-medium text-gray-900 mb-2">Provider Notes</h4>
              <p className="text-sm text-gray-600">{booking.providerNotes}</p>
            </div>
          )}
        </div>
      </div>

      {booking.status === 'COMPLETED' && (
        <div className="border-t border-gray-200 pt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
            Leave Review
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
