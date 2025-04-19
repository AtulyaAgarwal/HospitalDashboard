import React, { useState } from 'react';
import { addBed } from '../../../adapters/Beds/AddBed'; 

const AddBedModal = ({ onClose, onSave, wardId }) => {
  const [bedName, setBedName] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate the bed name
  const validate = () => {
    if (!bedName || isNaN(bedName) || bedName <= 0) {
      setErrors('Bed name must be a positive number and cannot be empty.');
      return false;
    }
    setErrors('');
    return true;
  };

  const handleSave = () => {
    if (loading) return; // Prevent multiple clicks while saving
    setLoading(true); // Set loading to true before API call

    if (validate()) {
      const newBed = { wardId, bedName };

      console.log("Sending data to API:", newBed);

      addBed(newBed)
        .then((response) => {
          console.log('Bed added successfully:', response.data);
          onSave(newBed);  // Pass back the newly added bed
          onClose();  // Close the modal
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error adding bed:', error);
          alert(
            error.response?.data?.message || 
            'Failed to add bed. Please try again.'
          );
          setLoading(false);
        })
    } else {
      console.log('Validation failed:', errors);
      setLoading(false); // Reset loading if validation fails
    }
  };

  return (
    <div className="modal">
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <h2>Add New Bed</h2>

        {/* Bed Name */}
        <div className="input-group">
          <input
            type="text"
            value={bedName}
            onChange={(e) => setBedName(e.target.value)}
            placeholder="Bed Name"
          />
          {errors && <p className="error">{errors}</p>}
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

export default AddBedModal;
