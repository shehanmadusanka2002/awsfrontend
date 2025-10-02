import React, { useState } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';
import IndustrialProductDetails from './IndustrialProductDetails';

const IndustrialStuffCard = ({ industrial, onPurchaseSuccess }) => {
  const [showModal, setShowModal] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:8080${imagePath}`;
    }
    return `http://localhost:8080/uploads/${imagePath}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          {industrial.imageUrls && industrial.imageUrls.length > 0 ? (
            <img
              src={getImageUrl(industrial.imageUrls[0])}
              alt={industrial.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = getImageUrl(null);
              }}
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <div className="text-4xl text-white">🔧</div>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              industrial.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {industrial.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {industrial.name}
          </h3>
          
          {industrial.category && (
            <div className="mb-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {industrial.category}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Stock: {industrial.stock}
            </span>
            {industrial.district && (
              <div className="flex items-center text-xs text-gray-500">
                <TruckIcon className="h-3 w-3 mr-1" />
                {industrial.district}
              </div>
            )}
          </div>

          {/* Sold Information */}
          {industrial.soldCount > 0 && (
            <div className="mb-4">
              <span className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">{industrial.soldCount}</span> sold
              </span>
            </div>
          )}

          <div className="mb-4">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(industrial.price)}
            </span>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            disabled={industrial.stock === 0}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition duration-300 ${
              industrial.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
            }`}
          >
            {industrial.stock === 0 ? 'Out of Stock' : 'View Details'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <IndustrialProductDetails
              industrial={industrial} 
              onClose={() => setShowModal(false)}
              onPurchaseSuccess={onPurchaseSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default IndustrialStuffCard;