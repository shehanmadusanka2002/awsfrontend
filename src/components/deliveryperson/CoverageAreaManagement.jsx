import React, { useState, useEffect } from 'react';
import DistrictSelector from './DistrictSelector';
import deliveryService from '../../services/deliveryService';

const CoverageAreaManagement = () => {
  const [coverageData, setCoverageData] = useState({});
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // ALL SRI LANKAN PROVINCES AND DISTRICTS WITH TOWNS
  const sriLankanDistricts = {
    'Western': {
      'Colombo': ['Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 04', 'Colombo 05', 'Colombo 06', 'Colombo 07', 'Colombo 08', 'Colombo 09', 'Colombo 10', 'Colombo 11', 'Colombo 12', 'Colombo 13', 'Colombo 14', 'Colombo 15', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Piliyandala', 'Kesbewa', 'Maharagama', 'Kotte', 'Battaramulla', 'Rajagiriya'],
      'Gampaha': ['Gampaha', 'Negombo', 'Katunayake', 'Wattala', 'Ja-Ela', 'Kandana', 'Ragama', 'Kiribathgoda', 'Kelaniya', 'Peliyagoda', 'Kadawatha', 'Mirigama', 'Minuwangoda', 'Divulapitiya', 'Nittambuwa', 'Veyangoda'],
      'Kalutara': ['Kalutara', 'Panadura', 'Horana', 'Matugama', 'Beruwala', 'Aluthgama', 'Bentota', 'Wadduwa', 'Bandaragama', 'Ingiriya', 'Bulathsinhala']
    },
    'Central': {
      'Kandy': ['Kandy', 'Peradeniya', 'Gampola', 'Nawalapitiya', 'Wattegama', 'Harispattuwa', 'Pathadumbara', 'Akurana', 'Kadugannawa', 'Pilimatalawa'],
      'Matale': ['Matale', 'Dambulla', 'Sigiriya', 'Naula', 'Ukuwela', 'Rattota', 'Pallepola', 'Galewela'],
      'Nuwara Eliya': ['Nuwara Eliya', 'Hatton', 'Talawakele', 'Nanu Oya', 'Maskeliya', 'Bogawantalawa', 'Kotagala', 'Ginigathhena']
    },
    'Southern': {
      'Galle': ['Galle', 'Hikkaduwa', 'Ambalangoda', 'Elpitiya', 'Bentota', 'Baddegama', 'Yakkalamulla', 'Neluwa', 'Nagoda', 'Imaduwa'],
      'Matara': ['Matara', 'Weligama', 'Mirissa', 'Dikwella', 'Tangalle', 'Kamburupitiya', 'Akuressa', 'Hakmana', 'Kotapola'],
      'Hambantota': ['Hambantota', 'Tissamaharama', 'Kataragama', 'Tangalle', 'Ambalantota', 'Beliatta', 'Weeraketiya', 'Suriyawewa']
    },
    'Northern': {
      'Jaffna': ['Jaffna', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Karainagar', 'Velanai', 'Kayts', 'Delft'],
      'Kilinochchi': ['Kilinochchi', 'Pallai', 'Paranthan', 'Poonakary'],
      'Mannar': ['Mannar', 'Nanattan', 'Madhu', 'Pesalai', 'Erukkalampiddy'],
      'Vavuniya': ['Vavuniya', 'Nedunkeni', 'Settikulam', 'Omanthai', 'Puliyankulam'],
      'Mullaitivu': ['Mullaitivu', 'Oddusuddan', 'Puthukudiyiruppu', 'Weli Oya', 'Manthai East']
    },
    'Eastern': {
      'Trincomalee': ['Trincomalee', 'Kinniya', 'Mutur', 'Kuchchaveli', 'Nilaveli', 'Uppuveli', 'Kantalai'],
      'Batticaloa': ['Batticaloa', 'Kalkudah', 'Passikudah', 'Valachchenai', 'Eravur', 'Oddamavadi', 'Chenkaladi'],
      'Ampara': ['Ampara', 'Akkaraipattu', 'Kalmunai', 'Sammanthurai', 'Pottuvil', 'Uhana', 'Damana', 'Mahaoya', 'Padiyathalawa']
    },
    'North Western': {
      'Kurunegala': ['Kurunegala', 'Puttalam', 'Chilaw', 'Kuliyapitiya', 'Narammala', 'Wariyapola', 'Pannala', 'Melsiripura', 'Bingiriya'],
      'Puttalam': ['Puttalam', 'Chilaw', 'Nattandiya', 'Wennappuwa', 'Marawila', 'Dankotuwa', 'Anamaduwa', 'Karuwalagaswewa']
    },
    'North Central': {
      'Anuradhapura': ['Anuradhapura', 'Kekirawa', 'Tambuttegama', 'Eppawala', 'Medawachchiya', 'Rambewa', 'Galenbindunuwewa', 'Mihintale'],
      'Polonnaruwa': ['Polonnaruwa', 'Kaduruwela', 'Medirigiriya', 'Hingurakgoda', 'Dimbulagala', 'Welikanda', 'Lankapura']
    },
    'Uva': {
      'Badulla': ['Badulla', 'Bandarawela', 'Ella', 'Haputale', 'Welimada', 'Diyatalawa', 'Hali Ela', 'Demodara', 'Passara'],
      'Monaragala': ['Monaragala', 'Wellawaya', 'Kataragama', 'Buttala', 'Bibile', 'Medagama', 'Siyambalanduwa']
    },
    'Sabaragamuwa': {
      'Ratnapura': ['Ratnapura', 'Embilipitiya', 'Balangoda', 'Pelmadulla', 'Eheliyagoda', 'Kuruwita', 'Godakawela', 'Kalawana'],
      'Kegalle': ['Kegalle', 'Mawanella', 'Warakapola', 'Rambukkana', 'Galigamuwa', 'Yatiyantota', 'Ruwanwella', 'Deraniyagala']
    }
  };

  // Mock coverage data
  const mockCoverageData = {
    selectedDistricts: ['Colombo', 'Gampaha'],
    selectedTowns: {
      'Colombo': ['Colombo 01', 'Colombo 02', 'Dehiwala'],
      'Gampaha': ['Negombo', 'Katunayake']
    }
  };

  const mockAvailability = {
    isAvailable: true
  };

  // Load coverage area data from backend
  useEffect(() => {
    const loadCoverageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await deliveryService.getCoverageAreaData();
        console.log('Coverage area response:', response);
        
        // The response is the data directly (not wrapped in {success, data})
        const data = response;
        
        // Set coverage data in the format expected by the component
        setCoverageData({
          selectedDistricts: data.selectedDistricts || [],
          selectedTowns: data.selectedTowns || {}
        });
        
        // Set availability status
        setAvailability({
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true
        });
      } catch (err) {
        console.error('Error loading coverage data:', err);
        
        // Handle different types of errors
        if (err.response?.status === 403) {
          setError('Access denied. Please ensure you have delivery person permissions.');
        } else if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else {
          setError('Failed to load coverage data. Please try again.');
        }
        
        // Use mock data as fallback
        setCoverageData(mockCoverageData);
        setAvailability(mockAvailability);
      } finally {
        setLoading(false);
      }
    };

    loadCoverageData();
  }, []);

  const updateCoverageData = async (newData) => {
    try {
      setSaving(true);
      setError(null);
      
      const updatedCoverageData = { ...coverageData, ...newData };
      
      // Prepare data for backend
      const backendData = {
        isAvailable: availability.isAvailable,
        selectedDistricts: updatedCoverageData.selectedDistricts || [],
        selectedTowns: updatedCoverageData.selectedTowns || {}
      };
      
      const response = await deliveryService.updateCoverageAreaData(backendData);
      console.log('Update coverage response:', response);
      
      // The response is the data directly (not wrapped in {success, data})
      setCoverageData(updatedCoverageData);
    } catch (err) {
      console.error('Error updating coverage data:', err);
      
      // Handle different types of errors
      if (err.response?.status === 403) {
        setError('Access denied. Please ensure you have delivery person permissions.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to update coverage data. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const newAvailability = !availability.isAvailable;
      
      const response = await deliveryService.updateAvailabilityStatus(newAvailability);
      console.log('Update availability response:', response);
      
      // The response is the data directly (not wrapped in {success, data})
      setAvailability(prev => ({ ...prev, isAvailable: newAvailability }));
    } catch (err) {
      console.error('Error updating availability:', err);
      
      // Handle different types of errors
      if (err.response?.status === 403) {
        setError('Access denied. Please ensure you have delivery person permissions.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to update availability. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coverage settings...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Access denied')) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-orange-500 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-orange-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-2"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Re-login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Coverage Settings</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Coverage Area Management</h1>
              <p className="text-gray-600">Configure your service areas and availability</p>
            </div>
            
            {/* Simple Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4 lg:mt-0">
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">{coverageData.selectedDistricts?.length || 0}</div>
                <div className="text-xs text-blue-600">Districts</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {Object.values(coverageData.selectedTowns || {}).flat().length || 0}
                </div>
                <div className="text-xs text-green-600">Towns</div>
              </div>
            </div>
          </div>
        </div>

        {/* AVAILABILITY TOGGLE - NO STATUS TEXT */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Service Availability</h3>
              <p className="text-gray-600 mt-1">Toggle your availability for new delivery requests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={availability.isAvailable}
                onChange={toggleAvailability}
                disabled={saving}
                className="sr-only peer"
              />
              <div className={`w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 ${saving ? 'opacity-50' : ''}`}></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {saving ? 'Updating...' : (availability.isAvailable ? 'Available' : 'Unavailable')}
              </span>
            </label>
          </div>
        </div>

        {/* ONLY DISTRICT SELECTOR */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Service Areas</h3>
            <p className="text-gray-600">Select the districts and towns you want to serve</p>
            {saving && (
              <div className="mt-2 flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Saving changes...</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <DistrictSelector
              districts={sriLankanDistricts}
              coverageData={coverageData}
              onUpdate={updateCoverageData}
              disabled={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageAreaManagement;
