import React, { useState } from 'react';
import { MapPin, CreditCard, Banknote, MessageSquare, X, Check } from 'lucide-react';

const OrderUI = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [supplierNote, setSupplierNote] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  
  // Auto-fill address from previous orders
  const previousAddresses = [
    "123 Main St, Colombo 03",
    
  ];

  const handleAddressSelect = (address) => {
    setShippingAddress(address);
  };

  const handleSubmitOrder = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    if (!shippingAddress) {
      alert('Please fill in the shipping address.');
      return;
    }
    alert('The order was successfully submitted!');
  };

  const orderItems = [
    { name: "5L Water Bottle", qty: 2, price: 200 },
    { name: "20L Water Bottle", qty: 1, price: 450 }
  ];

  const total = orderItems.reduce((sum, item) => sum + (item.qty * item.price), 0);

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Aqualink.lk</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Start Order</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-blue-500 w-5 h-5" />
                <h3 className="font-semibold text-gray-800">Shipping Address</h3>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Default string auto"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Previous addresses:</p>
                  {previousAddresses.map((address, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddressSelect(address)}
                      className="block w-full text-left p-2 text-sm bg-gray-100 hover:bg-blue-100 rounded border"
                    >
                      {address}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-blue-500 w-5 h-5" />
                <h3 className="font-semibold text-gray-800">Payment Method</h3>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedPaymentMethod === 'card'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-blue-500"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Add a new card</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={selectedPaymentMethod === 'cash'}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-blue-500"
                  />
                  <Banknote className="w-5 h-5 text-gray-600" />
                  <span>Cash on delivery</span>
                </label>
              </div>
            </div>

            {/* Add Note to Supplier */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={() => setShowNotePopup(true)}
                className="flex items-center gap-2 w-full p-3 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Add note to supplier</span>
              </button>
              {supplierNote && (
                <div className="mt-3 p-3 bg-gray-100 rounded border">
                  <p className="text-sm text-gray-700">{supplierNote}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit md:sticky md:top-4">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary (Items)</h3>
            
            <div className="space-y-3 mb-6">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold">Rs. {item.qty * item.price}</p>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-3 font-bold text-lg">
                <span>Total:</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Submit Order
            </button>

            {/* DIY Section */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">DIY Options</h4>
              <p className="text-sm text-gray-600">Installation service available</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Contact for installation →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Popup Modal */}
      {showNotePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Note to the Supplier</h3>
              <button
                onClick={() => setShowNotePopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <textarea
              placeholder="Please fill in..."
              value={supplierNote}
              onChange={(e) => setSupplierNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNotePopup(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setSupplierNote('');
                  setShowNotePopup(false);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderUI;