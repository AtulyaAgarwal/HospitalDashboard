import React, { useState, useEffect } from "react";
import { fetchCountryList } from "../../helper/LocationHelper.js";


const AddHospitalModal = ({ onClose, onSave }) => {
  const [hospitalName, setHospitalName] = useState("");
  const [address, setHospitalAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [statesInCountry, setStatesInCountry] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [countriesWithStates, setCountriesWithStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/states')
    .then((res) => res.json())
    .then((data) => {
      setCountriesWithStates(data.data);
      console.log(data.data);
    })
    .catch((err) => console.error('Error fetching countries and states:', err));
  }, []);

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

  const validate = () => {
    const newErrors = {};
    // const hospitalNameRegex = /^[A-Za-z0-9\s!#$%&'*+\-/=?^_`{|}~.,;:()[]{}<>@\\"]+$/;
    // const addressRegex =  /^[A-Za-z0-9\s!#$%&'*+\-/=?^_`{|}~.,;:()[]{}<>@\\"]+$/;
    const cityRegex = /^[A-Za-z0-9\s,]+$/;
    const numberRegex = /^[0-9]+$/;

    if (hospitalName.length < 3) {
      newErrors.hospitalName = 'Hospital name must be at least 3 characters long';
    }

    // if (!addressRegex.test(address)) {
    //   newErrors.address = 'Incorrect hospital address. Please try again.';
    // }

    if (!cityRegex.test(city)) {
      newErrors.city = 'Incorrect city name. Please try again.';
    }

    if (!numberRegex.test(pincode)) {
      newErrors.pincode = "Incorrect pincode. Please try again.";
    }

    if (!selectedCountry) {
      newErrors.country = 'Please select a Country.';
    }

    if (!selectedState) {
      newErrors.state = 'Please select a State.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;  
};


  const handleSave = () => {
    if (loading) return;
    if (!validate()) return;
    console.log("Hospital Name before sending to HospitalDashboard:", hospitalName);
    setLoading(true);
  
    const hospitalInfo = {
      hospitalName, // Store it for backend use
      address,
      country: selectedCountry,
      state: selectedState,
      city,
      pincode,
    };
  
    console.log("Sending hospital data to HospitalDashboard:", hospitalInfo);
    onSave(hospitalInfo);
  };
  

  return (
      <div className="modal">
        <div className="backdrop" onClick={onClose}></div>
        <div className="modal-content">
          <h2>Add New Hospital</h2>

          {/* Hospital Name */}
          <div className="input-group">
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Hospital Name"
            />
            {errors.hospitalName && <p className="error">{errors.hospitalName}</p>}
          </div>

          {/* Hospital Address */}
          <div className="input-group">
            <input
              type="text"
              value={address}
              onChange={(e) => setHospitalAddress(e.target.value)}
              placeholder="Hospital Address"
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>

          {/* Dropdown */}
          <div className="input-group">
            <select value={selectedCountry} disabled>
              <option value="India">India</option>
            </select>
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

          {/* City */}
          <div className="input-group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>

          {/* Pincode */}
          <div className="input-group">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Pincode"
            />
            {errors.pincode && <p className="error">{errors.pincode}</p>}
          </div>

          {/* Actions */}
          <div className="actions">
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSave} disabled={loading}>
              {loading ? <span className="loader"></span> : "Save"}
            </button>
          </div>
        </div>
      </div>
    
  );
};

export default AddHospitalModal;
