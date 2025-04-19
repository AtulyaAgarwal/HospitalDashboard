import React, { useState } from 'react';
import { AddPatientMonitor, AddVentilator, fetchBedMachines} from '../../../helper/DeviceHelper';

const AddMachineModal = ({ onClose, onSave, bedId }) => {
  const [machineType, setMachineType] = useState('');
  const [machineId, setMachineId] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState('');
  const [patientMonitor, setPatientMonitor] = useState([]);
  const [ventilator, setVentilator] = useState([]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!machineType) {
      setErrors('Please select a machine type.');
      return false;
    }

    if (machineType === 'patientMonitor' && (!machineId || !name)) {
      setErrors('Machine ID and Name are required for Patient Monitor.');
      return false;
    }

    if (machineType === 'ventilator' && !machineId) {
      setErrors('Machine ID is required for Ventilator.');
      return false;
    }

    setErrors('');
    return true;
  };

const handleSave = () => {
    if (loading) return; // Prevent multiple API calls
    setLoading(true); // Set loading to true before API call

    if (validate()) {
      const newMachine = {
        bedId,
        machineId,
        name,
        machineType,
      };
      onSave(newMachine);

      // console.log('Sending data to API:', newMachine);
      // console.log('New Machine Data:', newMachine);

      // // Determine machine type and call the respective add API
      // const addMachineApi =
      //   machineType === 'patientMonitor' ? AddPatientMonitor : AddVentilator;

      // addMachineApi(newMachine)
      //   .then((response) => {
      //     console.log(`${machineType} added successfully:`, response);

      //     onSave(newMachine); // Pass the new machine to the parent
      //     onClose(); // Close the modal
      //     setLoading(false);

      //     fetchBedMachines(bedId)
      //       .then((res) => {
      //         console.log('Fetched devices:', res);
      //         if (res.patientMonitor) setPatientMonitor([res.patientMonitor]);
      //         if (res.ventilator) setVentilator([res.ventilator]);
      //       })
      //       .catch((err) => console.error('Error fetching devices:', err));

      //     setLoading(false); // Reset loading state
      //   })
      //   .catch((error) => {
      //     console.error(`Error adding ${machineType}:`, error);
      //     setErrors(
      //       error.response?.data?.message ||
      //         `Failed to add ${machineType}. Please try again.`
      //     );
      //     setLoading(false); // Reset loading state
      //   });
    } else {
      console.log('Validation failed:', errors);
      setLoading(false); // Reset loading if validation fails
    }
  };


  return (
    <div className="modal">
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <h2>Add New Machine</h2>

        {/* Buttons to select machine type */}
        <div className="machine-type-buttons">
          <button
            onClick={() => setMachineType('patientMonitor')}
            className={`button ${
              machineType === 'patientMonitor' ? 'active' : ''
            }`}
          >
            Patient Monitor
          </button>
          <button
            onClick={() => setMachineType('ventilator')}
            className={`button ${
              machineType === 'ventilator' ? 'active' : ''
            }`}
          >
            Ventilator
          </button>
        </div>

        {/* Machine ID and Name (for Patient Monitor) */}
        {machineType === 'patientMonitor' && (
          <>
            <div className="input-group">
              <input
                type="text"
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                placeholder="Machine UDI"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
          </>
        )}

        {/* Machine ID (for Ventilator) */}
        {machineType === 'ventilator' && (
          <div className="input-group">
            <input
              type="text"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              placeholder="Ventilator ID"
            />
          </div>
        )}

        {errors && <p className="error">{errors}</p>}

        {/* Actions */}
        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddMachineModal;
