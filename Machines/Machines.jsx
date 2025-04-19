import React, { useState, useEffect , useCallback } from 'react';
import ReactTable from '../../../components/ReactTable/ReactTable'; // Reusable table component
import { useLocation } from 'react-router-dom';
import './Machines.css'; // Styling for machines dashboard
import { AddPatientMonitor, AddVentilator, fetchBedMachines } from '../../../helper/DeviceHelper'; // Helper function to fetch device data
import AddMachineModal from './AddMachineModal'; // Import the AddMachineModal component
import { UpdateBedDevice } from '../../../helper/DeviceHelper';
import { useNavigate } from 'react-router-dom';
const MachinesDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bedId = queryParams.get('bedId');
  const [beds, setBeds] = useState([]);
  const [ward, setWard] = useState({});
  const [hospital, setHospital] = useState({});
  const [patientMonitor, setPatientMonitor] = useState([]);
  const [ventilator, setVentilator] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // Dynamic success message
  const [errorMessage, setErrorMessage] = useState(''); // Dynamic error message
  const navigate = useNavigate();

  // Fetch machines for the specified bed
  const fetchMachinesData = useCallback(() => {
    if (bedId) {
      fetchBedMachines(bedId)
        .then((res) => {
          console.log('Fetched devices:', res); // Debugging log
          setBeds(res['bed']);
          setWard(res['ward']);
          setHospital(res['hospital']);
          if (res.patientMonitor) setPatientMonitor([res.patientMonitor]);
          if (res.ventilator) setVentilator([res.ventilator]);
        })
        .catch((err) => console.error('Error fetching devices:', err));
    }
  }, [bedId]);  // Add bedId to the dependencies of the useCallback hook

  // UseEffect to fetch machines data when bedId changes
  useEffect(() => {
    fetchMachinesData();
  }, [fetchMachinesData]); 

  // Handle adding a machine (Ventilator or Patient Monitor)
  const handleAddMachine = (newMachine) => {
    console.log("Received New Machine:", newMachine); // Debugging log

    let monitorId = null;
    let ventilatorId = null;

    if (newMachine.machineType === 'ventilator') {
        AddVentilator(newMachine)
            .then((addedVentilator) => {
                console.log('Ventilator added with ID:', addedVentilator);  // Debugging log
                ventilatorId = addedVentilator?.ventilator?.id;  // Ensure ventilatorId is assigned here
                setSuccessMessage("✅ Ventilator added successfully!");
                
                setIsModalOpen(false);
                setShowSuccessPopup(true);

                console.log('Updating bed device with ventilatorId:', ventilatorId); // Add this log before making the API request

                UpdateBedDevice(bedId, null, ventilatorId)
                    .then(() => {
                        setTimeout(() => setSuccessMessage(''), 3000);
                    })
                    .catch((error) => {
                        console.error("Error updating bed device with ventilator:", error);
                        setErrorMessage("❌ Failed to update bed device with ventilator.");
                    });
                
                fetchMachinesData(); // Refresh table data
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding ventilator:", error);
                setErrorMessage("❌ Failed to add ventilator.");
                setTimeout(() => setSuccessMessage(''), 3000);
            });
    }

    if (newMachine.machineType === 'patientMonitor') {
        AddPatientMonitor(newMachine)
            .then((addedPatientMonitor) => {
                console.log('Patient Monitor added with ID:', addedPatientMonitor);
                monitorId = addedPatientMonitor?.patientMonitor?.id;
                console.log('Patient Monitor added with ID:', monitorId);  // Debugging log
                setSuccessMessage("✅ Patient Monitor added successfully!");
                
                setIsModalOpen(false);
                setShowSuccessPopup(true);

                UpdateBedDevice(bedId, monitorId, null) // Make sure monitorId is not null
                    .then(() => {
                        setTimeout(() => setSuccessMessage(''), 3000);
                    })
                    .catch((error) => {
                        console.error("Error updating bed device with patient monitor:", error);
                        setErrorMessage("❌ Failed to update bed device with patient monitor.");
                    });
                
                fetchMachinesData(); // Refresh table data
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding patient monitor:", error);
                setErrorMessage("❌ Failed to add patient monitor.");
                setTimeout(() => setSuccessMessage(''), 3000);
            });
    }
};

const handleTitlesClick = (hospital) => {
  navigate(`/hospital-details/wards?hospitalId=${hospital.id}`);
};

const handleWardClick = (ward) => {
  navigate(`/hospital-details/beds?wardId=${ward.id}`);
};

  // Close the modal and pop-up
 

  return (
    <div className="machines-dashboard">
      {/* Success Popup */}
      {showSuccessPopup && <div className="success-popup">{successMessage}</div>}

      {/* Error Popup */}
      {errorMessage && <div className="error-popup">{errorMessage}</div>}

      {/* Title and Button Container */}
      {/* <div className="add-machine-btn-wrapper">
        
      </div> */}

      {/* Patient Monitor Table */}
      
      
      
        <div className='Patient-header'>
        <div className='machine-breadcrumbs'>
        <label>
          <span 
            onClick={() => handleTitlesClick(hospital)} 
            style={{ cursor: "pointer" }}
          >
            {hospital?.name || ''}
          </span> {'>'} <span 
            onClick={() => handleWardClick(ward)} 
            style={{ cursor: "pointer" }}
          >
            {ward?.name || ''}
          </span> {'>'} {bedId} {'>'} Devices
        </label>
        </div>
         
        <button className="add-machine-btn" onClick={() => setIsModalOpen(true)}>
          Add Machine
        </button>
        </div>
        <div className="machine-section">
          <h3>Patient Monitor</h3>
        <ReactTable
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Serial ID', dataIndex: 'serialId', key: 'serialId' },
            { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
            { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
            { title: 'Is Active', dataIndex: 'isActive', key: 'isActive' },
          ]}
          data={patientMonitor}
          rowKey="id"
          className="react-table"
        />
      </div>

      {/* Ventilator Table */}
      <div className="machine-section">
        <h4>Ventilators</h4>
        <ReactTable
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Ventilator ID', dataIndex: 'ventilatorId', key: 'ventilatorId' },
            { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
            { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
            { title: 'Is Active', dataIndex: 'isActive', key: 'isActive' },
          ]}
          data={ventilator}
          rowKey="id"
          className="react-table"
        />
      </div>

      {/* Add Machine Modal */}
      {isModalOpen && (
        <AddMachineModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddMachine}
          bedId={bedId}
        />
      )}
    </div>
  );
};

export default MachinesDashboard;
