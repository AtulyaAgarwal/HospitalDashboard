import React, { useState } from 'react';
import { addWard } from '../../../adapters/Ward/AddWard';

const AddWardModal = ({ onClose, onSave, hospitalId }) => {
  const [wardName, setWardName] = useState('');
  
  const [errors, setErrors] = useState('');

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const specialCharRegex = /^[A-Za-z0-9\s.-]*$/; 
    if (!wardName || !specialCharRegex.test(wardName)) {
      setErrors('Ward name must not be empty');
      return false;
    }
    setErrors('');
    return true;
};



  const handleSave = () => {
    if (loading) return; // Prevent multiple API calls
    setLoading(true); // Set loading to true before API call

    if (validate()) {
      const newWard = { hospitalId, wardName };

      console.log("Sending data to API:", newWard);

      addWard(newWard)
        .then((response) => {
          console.log('Ward added successfully:', response.data);
          onSave(newWard);  
          onClose();  
          setLoading(false); // Set loading to false after success
        })
        .catch((error) => {
          console.error('Error adding ward:', error);
          alert(
            error.response?.data?.message || 
            'Failed to add ward. Please try again.'
          );
          setLoading(false); // Set loading to false after error
        });
    } else {
      console.log('Validation failed:', errors);
      setLoading(false); // Set loading to false if validation fails
    }
};

  

  return (
    <div className="modal">
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <h2>Add New Ward</h2>

        {/* Ward Name */}
        <div className="input-group">
          <input
            type="text"
            value={wardName}
            onChange={(e) => setWardName(e.target.value)}
            placeholder="Ward Name"
          />
          {
            errors && <p className="error">{errors}</p>
          }
        </div>

        {/* Actions */}
        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddWardModal;
