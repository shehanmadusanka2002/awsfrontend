import React, { useState } from 'react';
import ProductDetails from './ProductDetails.jsx';

const FishCard = ({ fish, onPurchaseSuccess }) => {
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(price);
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
  const fullUrl = `http://54.173.35.19:8080${imagePath}`;
      console.log("Constructed URL:", fullUrl);
      return fullUrl;
    }

  const fullUrl = `http://54.173.35.19:8080/uploads/${imagePath}`;
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <img
            src={getImageUrl(fish.imageUrls?.[0])}
            alt={fish.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              fish.stock > 0 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {fish.stock > 0 ? `In Stock: ${fish.stock}` : 'Out of Stock'}
            </span>
            
            {/* Verified Badge */}
            {fish.activeStatus === 'VERIFIED' && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-3">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
              {fish.name}
            </h4>
            
          </div>

          {/* Location */}
          {fish.district && (
            <div className="mb-2 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{fish.district}</span>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(fish.price)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Min. Quantity: {fish.minimumQuantity}</span>
              <span>Available: {fish.stock}</span>
            </div>
          </div>

          <button
            onClick={() => setShowProductDetails(true)}
            disabled={fish.stock === 0}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition duration-300 ${
              fish.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
            }`}
          >
            {fish.stock === 0 ? 'Out of Stock' : 'View Details'}
          </button>
        </div>
      </div>

      {showProductDetails && (
        <ProductDetailsModal
          fish={fish}
          isOpen={showProductDetails}
          onClose={() => setShowProductDetails(false)}
          onPurchaseSuccess={onPurchaseSuccess}
        />
      )}
    </>
  );
};

// Modal wrapper for ProductDetails
const ProductDetailsModal = ({ fish, isOpen, onClose, onPurchaseSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Product Details Component */}
        <ProductDetails
          fish={fish} 
          onClose={onClose}
          onPurchaseSuccess={onPurchaseSuccess}
        />
      </div>
    </div>
  );
};

export default FishCard;
