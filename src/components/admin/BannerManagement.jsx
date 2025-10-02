import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/banners");
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file);
      setMsg("");
    } else {
      setSelectedFile(null);
      setMsg("Please select a valid JPEG or PNG image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMsg("Please select an image file.");
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("bannerImage", selectedFile);

      await axios.post("http://localhost:8080/api/banners/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMsg("Banner added successfully!");
      setSelectedFile(null);
      document.getElementById("banner-file-input").value = "";
      
      // Refresh the banner list
      fetchBanners();
    } catch (error) {
      setMsg("Failed to add banner. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await axios.delete(`http://localhost:8080/api/banners/${bannerId}`);
        setMsg("Banner deleted successfully!");
        fetchBanners();
      } catch (error) {
        setMsg("Failed to delete banner.");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Banner Management</h1>
      
      {/* Add New Banner Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Banner Image (JPEG/PNG)
            </label>
            <input
              id="banner-file-input"
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
          
          {/* Preview */}
          {selectedFile && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Preview:</label>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Banner preview"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading..." : "Add Banner"}
          </button>
        </form>
        
        {msg && (
          <div className={`mt-4 ${msg.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {msg}
          </div>
        )}
      </div>

      {/* Existing Banners */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Current Banners ({banners.length})</h2>
        
        {banners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No banners available. Add your first banner above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div key={banner.bannerId} className="border rounded-lg p-4">
                <img
                  src={`http://localhost:8080${banner.imageUrl}`}
                  alt="Banner"
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ID: {banner.bannerId}</span>
                  <button
                    onClick={() => handleDelete(banner.bannerId)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
