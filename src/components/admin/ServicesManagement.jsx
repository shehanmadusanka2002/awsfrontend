import React, { useState, useEffect } from 'react';

const ServicesManagement = () => {
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pendingCount: 0 });

  useEffect(() => {
    fetchPendingServices();
    fetchStats();
  }, []);

  const fetchPendingServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/services/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPendingServices(data.content || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending services:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/services/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/services/${serviceId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Service approved successfully!');
        fetchPendingServices();
        fetchStats();
      }
    } catch (error) {
      console.error('Error approving service:', error);
      alert('Failed to approve service');
    }
  };

  const handleReject = async (serviceId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/services/${serviceId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        alert('Service rejected successfully!');
        fetchPendingServices();
        fetchStats();
      }
    } catch (error) {
      console.error('Error rejecting service:', error);
      alert('Failed to reject service');
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Services Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">{stats.pendingCount}</div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
          </div>
        </div>

        {pendingServices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">No services pending approval at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Services Pending Approval ({pendingServices.length})
            </h2>
            
            {pendingServices.map((service) => (
              <AdminServiceCard
                key={service.id}
                service={service}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminServiceCard = ({ service, onApprove, onReject }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(service.id);
    setIsProcessing(false);
  };

  const handleReject = async (reason) => {
    setIsProcessing(true);
    await onReject(service.id, reason);
    setIsProcessing(false);
    setShowRejectModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                PENDING
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Submitted on {new Date(service.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {service.imagePaths && service.imagePaths.length > 0 && (
            <div className="w-24 h-24 rounded-lg overflow-hidden ml-4">
              <img
                src={`http://localhost:8080${service.imagePaths[0]}`}
                alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center" style={{ display: 'none' }}>
                <div className="text-2xl text-white">🛠️</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div><span className="font-medium">Category:</span> {service.category}</div>
              <div><span className="font-medium">Price:</span> ${service.price}</div>
              {service.maxPrice && (
                <div><span className="font-medium">Max Price:</span> ${service.maxPrice}</div>
              )}
              {service.duration && (
                <div><span className="font-medium">Duration:</span> {service.duration}</div>
              )}
              {service.location && (
                <div><span className="font-medium">Location:</span> {service.location}</div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{service.description}</p>
            
            {service.requirements && (
              <div className="mt-3">
                <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                <p className="text-sm text-gray-600">{service.requirements}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isProcessing}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Reject'}
          </button>
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
          >
            {isProcessing ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          serviceName={service.name}
          onReject={handleReject}
          onClose={() => setShowRejectModal(false)}
        />
      )}
    </>
  );
};

const RejectModal = ({ serviceName, onReject, onClose }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsSubmitting(true);
    await onReject(reason);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reject Service</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <p className="text-gray-600 mb-4">
          Please provide a reason for rejecting "<strong>{serviceName}</strong>":
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            rows="4"
            placeholder="Enter rejection reason..."
            required
          />

          <div className="flex space-x-3">
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
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300"
            >
              {isSubmitting ? 'Rejecting...' : 'Reject Service'}
            
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesManagement;
