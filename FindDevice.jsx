import React, { useState } from "react";
import './HospitalDashboard.css';
import { FindVentilator, FindPatientMonitor } from "../../helper/DeviceHelper";
import { useNavigate } from "react-router-dom";

const FindDeviceModal = ({ onClose }) => {
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [deviceNotFound, setDeviceNotFound] = useState(false);
  const navigate = useNavigate();

  const handleDeviceTypeSelection = (type) => {
    setSelectedDeviceType(type);
    setDeviceId(""); // Reset input when selecting a different device type
  };

  const handleFindDevice = async () => {
    if (!deviceId) return;

    let data;
    if (selectedDeviceType === "ventilator") {
      data = await FindVentilator(deviceId);
    } else if (selectedDeviceType === "patientMonitor") {
      data = await FindPatientMonitor(deviceId);
    }
    
    console.log("Find Device API Response:", data);
    const bedId = data;
    console.log("BedID  : ", data);

    if (data) {
        console.log("bedId:", data);
        console.log("Navigating to:", `/hospital-details/devices?bedId=${data}`);
        navigate(`/hospital-details/devices?bedId=${data}`);
        onClose(); // Close the modal after successful search
    } 
    else {
      setDeviceNotFound(true);
      setTimeout(() => setDeviceNotFound(false), 3000);
    }
  };

  return (
    <div className="find-device-modal">
      <div className="modal-content">
        <h5>Find Device</h5>
        <button className="close-button" onClick={onClose}>✖</button>

        {!selectedDeviceType ? (
          <div className="device-selection">
            <button onClick={() => handleDeviceTypeSelection("ventilator")}>
              Ventilator
            </button>
            <button onClick={() => handleDeviceTypeSelection("patientMonitor")}>
              Patient Monitor
            </button>
          </div>
        ) : (
          <div className="search-section">
            <input
              type="text"
              placeholder={`Enter ${selectedDeviceType === "ventilator" ? "Ventilator" : "Monitor"} ID...`}
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFindDevice()}
            />
            <button className="search-button" onClick={handleFindDevice}>search</button>
            {deviceNotFound && <div className="error-message">❌ Device not found.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDeviceModal;
