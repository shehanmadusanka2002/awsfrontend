import React, { useState } from 'react';

const FishAdsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    minimumQuantity: '',
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setSelectedImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem('user'))
    const nicNumber = userData?.nicNumber;
    const token = localStorage.getItem('token'); // Get JWT token

    if (!nicNumber) {
      alert('NIC Number not found in local storage');
      return;
    }

    const formDataToSend = new FormData();

    // Create the fishAdsRequest object
    const fishAdsRequest = {
      ...formData,
      nicNumber: nicNumber,
      stock: parseInt(formData.stock),
      price: parseFloat(formData.price),
      minimumQuantity: parseInt(formData.minimumQuantity)
    };

    // Append fishAdsRequest as JSON
    formDataToSend.append('fishAdsRequest', JSON.stringify(fishAdsRequest));

    // Append images with the correct name "images"
    selectedImages.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const headers = {
        // Don't set Content-Type for FormData - let browser set it
      };

      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8080/api/fish-ads', {
        method: 'POST',
        headers: headers,
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Product added successfully!');
        console.log('Success:', result);
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          stock: '',
          price: '',
          minimumQuantity: '',
        });
        setSelectedImages([]);
        setImagePreviews([]);
        
        // Clean up preview URLs
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert(`Failed to add product: ${errorText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (Max 5) *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quantity *</label>
          <input
            type="number"
            name="minimumQuantity"
            value={formData.minimumQuantity}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default FishAdsForm;