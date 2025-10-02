import React, { useState, useEffect } from 'react';
import { adminAPI, utils } from '../../services/api';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  DocumentTextIcon,
  UserIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const UserVerification = () => {
  const [filter, setFilter] = useState('pending');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch users on component mount and when filter changes
  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!utils.isAuthenticated()) {
        throw new Error('No authentication token found');
      }

      const response = await adminAPI.getVerificationUsers();
      
      console.log('Raw API response:', response);
      console.log('Users data:', response.data);
      
      // Transform backend data to match frontend expectations
      const transformedUsers = response.data.map(user => ({
        ...user,
        // Handle image URLs using utility function
        nicFrontDocument: utils.getImageUrl(user.nicFrontDocument),
        nicBackDocument: utils.getImageUrl(user.nicBackDocument),
        selfieDocument: utils.getImageUrl(user.selfieDocument),
        // Ensure userRoles is an array
        userRoles: user.userRoles || []
      }));
      
      console.log('Transformed users:', transformedUsers);
      console.log('User statuses:', transformedUsers.map(u => ({ id: u.id, name: u.name, status: u.status })));
      
      setUsers(transformedUsers);
      setMessage('');
    } catch (error) {
      console.error('Error fetching users:', error);
      
      if (error.response?.status === 401) {
        setMessage('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        setMessage('You do not have permission to view this data.');
      } else {
        setMessage('Failed to fetch users. Please try again later.');
      }
      
      // If API fails, set empty users array
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'pending') return user.status === 'PENDING';
    if (filter === 'verified') return user.status === 'APPROVED';
    if (filter === 'rejected') return user.status === 'REJECTED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'Verified';
      case 'PENDING':
        return 'Pending';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const openImageModal = (imageUrl, imageName) => {
    setSelectedImage({ url: imageUrl, name: imageName });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const handleUserAction = async (userId, action) => {
    setActionLoading(true);
    setMessage('');

    try {
      if (!utils.isAuthenticated()) {
        throw new Error('No authentication token found');
      }

      let response;
      if (action === 'approve') {
        response = await adminAPI.approveUser(userId);
      } else {
        response = await adminAPI.rejectUser(userId);
      }

      if (response.data.status === 'success' || response.status === 200) {
        setMessage(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        
        // Refresh users list
        await fetchUsers();
        
        // Clear selection if user was selected
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }

        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } else {
        throw new Error(response.data.message || 'Unknown error occurred');
      }

    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      
      if (error.response?.status === 401) {
        setMessage('Authentication failed. Please login again.');
        utils.clearAuth();
      } else if (error.response?.status === 403) {
        setMessage('You do not have permission to perform this action.');
      } else {
        setMessage(`Failed to ${action} user: ${error.response?.data?.error || error.message}`);
      }
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Verification</h1>
        <p className="text-gray-600 mt-1">Review and verify user registration documents</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.includes('successfully') ? (
              <CheckCircleIcon className="w-5 h-5 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        {[
          { key: 'all', label: 'All Users' },
          { key: 'pending', label: 'Pending Verification' },
          { key: 'verified', label: 'Verified' },
          { key: 'rejected', label: 'Rejected' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-2 text-gray-600">Loading users...</span>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.status === 'PENDING').length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-500">Verified</div>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'APPROVED').length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-500">Rejected</div>
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === 'REJECTED').length}
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">NIC: {user.nicNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.userRoles && user.userRoles.map((role, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {role.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                          {getStatusText(user.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => viewUserDetails(user)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {user.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleUserAction(user.id, 'approve')}
                                disabled={actionLoading}
                                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                                title="Approve User"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleUserAction(user.id, 'reject')}
                                disabled={actionLoading}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                                title="Reject User"
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No users match the current filter criteria.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">User Verification Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* User Info */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">User Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">NIC Number:</span>
                    <p className="text-sm text-gray-900">{selectedUser.nicNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <p className="text-sm text-gray-900">{selectedUser.phoneNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedUser.status)}`}>
                      {getStatusText(selectedUser.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Registration Date:</span>
                    <p className="text-sm text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">User Roles:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedUser.userRoles && selectedUser.userRoles.map((role, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                        {role.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Submitted Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* NIC Front */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">NIC Front Side</h5>
                    <div className="relative group">
                      <img 
                        src={selectedUser.nicFrontDocument || '/api/placeholder/300/200'} 
                        alt="NIC Front"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => openImageModal(selectedUser.nicFrontDocument, 'NIC Front Side')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded cursor-pointer">
                        <MagnifyingGlassIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* NIC Back */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">NIC Back Side</h5>
                    <div className="relative group">
                      <img 
                        src={selectedUser.nicBackDocument || '/api/placeholder/300/200'} 
                        alt="NIC Back"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => openImageModal(selectedUser.nicBackDocument, 'NIC Back Side')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded cursor-pointer">
                        <MagnifyingGlassIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Selfie */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Selfie with NIC</h5>
                    <div className="relative group">
                      <img 
                        src={selectedUser.selfieDocument || '/api/placeholder/300/200'} 
                        alt="Selfie"
                        className="w-full h-32 object-cover rounded cursor-pointer"
                        onClick={() => openImageModal(selectedUser.selfieDocument, 'Selfie with NIC')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded cursor-pointer">
                        <MagnifyingGlassIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedUser.status === 'PENDING' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'approve')}
                    disabled={actionLoading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    {actionLoading ? 'Processing...' : 'Approve User'}
                  </button>
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'reject')}
                    disabled={actionLoading}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <XCircleIcon className="w-5 h-5 mr-2" />
                    {actionLoading ? 'Processing...' : 'Reject User'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="text-center">
              <h3 className="text-white text-lg font-medium mb-4">{selectedImage.name}</h3>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerification;
