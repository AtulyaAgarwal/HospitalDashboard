import React, { useState, useEffect } from 'react';
import ReactTable from '../../components/ReactTable/ReactTable';
import AddHospitalModal from './AddHospitalModal.jsx';
import { fetchHospitalList } from '../../helper/HospitalHelper.js';
import { AddHospital } from "../../adapters/HospitalDashboard/AddHospital.js";
import SignUpModal from './signUpModal.jsx';
import { addHospital } from '../../helper/HospitalHelper.js';
import { useNavigate } from 'react-router-dom';
import './HospitalDashboard.css';
import FindDeviceModal from './FindDevice.jsx';

const HospitalDashboard = () => {
  console.log("mounting HospitalDashboard");
  const navigate = useNavigate(); // Hook for navigation

  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [statesInCountry, setStatesInCountry] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [countriesWithStates, setCountriesWithStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalData, setHospitalData] = useState(null); // Store hospital data
  const [showFindDeviceModal, setShowFindDeviceModal] = useState(false);

  useEffect(() => {
    fetchHospitalList()
      .then((res) => setHospitals(res.data))
      .catch((err) => console.error(err));

    fetch('https://countriesnow.space/api/v0.1/countries/states')
      .then((res) => res.json())
      .then((data) => {
        setCountriesWithStates(data.data);
        console.log(data.data);
      })
      .catch((err) => console.error('Error fetching countries and states:', err));
  }, [showSuccessPopup]);

  // Effect to automatically set states of India when the data is fetched
  useEffect(() => {
    if (countriesWithStates.length > 0) {
      const india = countriesWithStates.find((country) => country.name === 'India');
      if (india) {
        setStatesInCountry(india.states); // Set states of India
        setSelectedState(''); // Set first state as default (optional)
      }
    }
  }, [countriesWithStates]);

  // Handle country change (disabled in this case)
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
  };

  // Handle state change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleAddHospital = (newHospital) => {    
    console.log("Received hospital from modal:", newHospital);
  
    if (!newHospital.hospitalName) {
      console.error("Error: hospitalName is missing from newHospital");
      return;
    }

    addHospital(newHospital)
      .then((response) => {
        console.log("Hospital added successfully:", response);
        setHospitals([...hospitals, newHospital]);
        setHospitalName(newHospital.hospitalName); 
        console.log("Updated hospitalName state:", newHospital.hospitalName);
        setIsModalOpen(false);
        setShowSuccessPopup(true);

        setTimeout(() => {
          setShowSuccessPopup(false);
          setShowSignUp(true); // Open signup modal without showing hospital name
        }, 3000);
      })
      .catch((err) => {
        console.error("Error adding hospital:", err);
        alert(err);
      });
  };


  const handleSignUpSubmit = (userData) => {
    setLoading(true);
  
    const hospitalWithUser = { 
      ...userData, // User's signup details
      hospitalName: hospitalName // Send hospital name silently
    };
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountry || hospital?.country === selectedCountry;
    const matchesState = !selectedState || hospital?.state === selectedState;
    return matchesSearch && matchesCountry && matchesState;
  });

  const handleRowClick = (record) => {
    console.log("Navigating to:", `/hospital-details/wards?hospitalId=${record.id}`);
    navigate(`/hospital-details/wards?hospitalId=${record.id}`);
  };
  
  
  const getColumns = () => [
    { title: 'Hospital Name', dataIndex: 'name', key: 'name' },
    { title: 'Hospital Address', dataIndex: 'address', key: 'address' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Pincode', dataIndex: 'pincode', key: 'pincode' },
  ];

  return (
    <div className="hospital-dashboard">
    
      <div className="filters-and-actions">
        <div className="hospital-title">
          <label>Hospitals</label>
        </div>

        {/* Find Device Button */}
        <button className="find-device-btn" onClick={() => setShowFindDeviceModal(true)}>
        Find Device
        </button>

        <div className="filters">
          <div className="filters-title">Filters</div>
          <div className="input-group">
            
          </div>
          <div className="input-group">
            <select value={selectedState} onChange={handleStateChange} >
              <option value="">All States</option>
              {statesInCountry.map((state, index) => (
                <option key={`${state.name}-${index}`} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showSuccessPopup && (
          <div className="success-popup">
            <span>✅ Hospital added Successfully!</span>
          </div>
        )}

        <button className="add-hospital-btn" onClick={() => setIsModalOpen(true)}>
          Add Hospital
        </button>
      </div>

      <ReactTable
        columns={getColumns()}
        data={filteredHospitals}
        rowKey="id"
        config={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        className="react-table"
      />
      {isModalOpen && (
        <AddHospitalModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddHospital}
          countriesWithStates={countriesWithStates}
        />
      )}

      {/* Show Signup Modal with Hospital Name */}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
          onSignUpSubmit={handleSignUpSubmit}
          hospitalName={hospitalName}
        />
      )}
      {/* Find Device Modal */}
      {showFindDeviceModal && (
        <FindDeviceModal onClose={() => setShowFindDeviceModal(false)} />
      )}
    </div>
  );
};

export default HospitalDashboard;
