import React, { useState } from 'react';

const AvailabilityManager = ({ availability, onUpdate }) => {
  const [tempAvailability, setTempAvailability] = useState(availability);
  const [hasChanges, setHasChanges] = useState(false);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleChange = (field, value) => {
    const newAvailability = { ...tempAvailability, [field]: value };
    setTempAvailability(newAvailability);
    setHasChanges(true);
  };

  const handleWorkingHoursChange = (field, value) => {
    const newWorkingHours = { ...tempAvailability.workingHours, [field]: value };
    handleChange('workingHours', newWorkingHours);
  };

  const toggleWorkingDay = (day) => {
    const currentDays = tempAvailability.workingDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    handleChange('workingDays', newDays);
  };

  const saveChanges = () => {
    onUpdate(tempAvailability);
    setHasChanges(false);
  };

  const resetChanges = () => {
    setTempAvailability(availability);
    setHasChanges(false);
  };

  const getAvailabilityStatus = () => {
    if (!tempAvailability.isAvailable) return { text: 'Offline', color: 'bg-red-500' };
    
    const now = new Date();
    const currentDay = daysOfWeek[now.getDay() - 1] || 'Sunday';
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = parseTime(tempAvailability.workingHours?.start || '08:00');
    const endTime = parseTime(tempAvailability.workingHours?.end || '18:00');

    if (!tempAvailability.workingDays?.includes(currentDay)) {
      return { text: 'Off Day', color: 'bg-yellow-500' };
    }

    if (currentTime < startTime || currentTime > endTime) {
      return { text: 'Outside Hours', color: 'bg-orange-500' };
    }

    if (tempAvailability.currentDeliveries >= tempAvailability.maxDeliveries) {
      return { text: 'At Capacity', color: 'bg-purple-500' };
    }

    return { text: 'Available', color: 'bg-green-500' };
  };

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const status = getAvailabilityStatus();

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Status</h3>
            <div className="flex items-center space-x-4">
              <div className={`${status.color} text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>{status.text}</span>
              </div>
              <div className="text-gray-600">
                {tempAvailability.currentDeliveries || 0} / {tempAvailability.maxDeliveries || 15} deliveries
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {tempAvailability.workingHours ? 
                `${formatTime(tempAvailability.workingHours.start)} - ${formatTime(tempAvailability.workingHours.end)}` : 
                'Not Set'
              }
            </div>
            <div className="text-gray-600">Working Hours</div>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Service Availability</h3>
            <p className="text-gray-600 mt-1">Toggle your availability for new delivery requests</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={tempAvailability.isAvailable}
              onChange={(e) => handleChange('isAvailable', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={tempAvailability.workingHours?.start || '08:00'}
              onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={tempAvailability.workingHours?.end || '18:00'}
              onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Working Days */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Days</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {daysOfWeek.map(day => (
            <label
              key={day}
              className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition duration-200 ${
                tempAvailability.workingDays?.includes(day)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={tempAvailability.workingDays?.includes(day) || false}
                onChange={() => toggleWorkingDay(day)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-semibold">{day.slice(0, 3)}</div>
                <div className="text-xs">{day}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Capacity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Capacity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Deliveries per Day
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={tempAvailability.maxDeliveries || 15}
              onChange={(e) => handleChange('maxDeliveries', parseInt(e.target.value) || 15)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Active Deliveries
            </label>
            <input
              type="number"
              min="0"
              value={tempAvailability.currentDeliveries || 0}
              onChange={(e) => handleChange('currentDeliveries', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Capacity Used</span>
            <span>
              {tempAvailability.currentDeliveries || 0} / {tempAvailability.maxDeliveries || 15}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                (tempAvailability.currentDeliveries || 0) >= (tempAvailability.maxDeliveries || 15)
                  ? 'bg-red-500'
                  : (tempAvailability.currentDeliveries || 0) >= (tempAvailability.maxDeliveries || 15) * 0.8
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ 
                width: `${Math.min(((tempAvailability.currentDeliveries || 0) / (tempAvailability.maxDeliveries || 15)) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Special Notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Notes</h3>
        <textarea
          value={tempAvailability.specialNotes || ''}
          onChange={(e) => handleChange('specialNotes', e.target.value)}
          placeholder="Add any special notes about your availability or service conditions..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Save Changes */}
      {hasChanges && (
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Unsaved Changes</h4>
              <p className="text-gray-600">You have unsaved changes to your availability settings.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetChanges}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                Reset
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
