import React, { useState, useEffect } from 'react';
import { fetchHospitalWards, AddWard } from '../../../helper/WardHelper';  // Import the helper functions
import ReactTable from '../../../components/ReactTable/ReactTable';  // Assuming you have a reusable table component
//import AddWardModal from './AddWardModal';  // Modal for adding wards
import './Wards.css';  // Styling for the dashboard
import { Link , useLocation } from 'react-router-dom';  // For linking to ward details
import { useNavigate } from 'react-router-dom';
import AddWardModal from './AddWardModal';
import SignUpModal from '../signUpModal';
const WardDashboard = () => {
    console.log("==========================================================================================");
    console.log("mounting WardDashboard");
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hospitalId = queryParams.get('hospitalId');


  const [wards, setWards] = useState([]);  // State to hold the wards list
  const [hospital, setHospital] = useState({});
  const [searchQuery, setSearchQuery] = useState('');  // State for search filter
  const [isAddWardModalOpen, setIsAddWardModalOpen] = useState(false);  // For Add Ward Modal
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);  // For success message
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (hospitalId) {
      fetchHospitalWards(hospitalId)
        .then((res) => {
          console.log("res ward", res);
          setWards(res.data);
          setHospital(res.hospital);
        }) // Set the fetched wards to state
        .catch((err) => console.error("Error fetching wards:", err)); // Handle fetch error
    } else {
      console.error("No hospitalId found in query parameters.");
    }
  }, [hospitalId, showSuccessPopup]);

  // Filter the wards based on the search query
  const filteredWards = (wards.length && wards || [])?.filter((ward) => {
    return ward?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  //Handle adding a new ward
  const handleAddWard = (newWard) => {
    console.log("Adding Ward:", newWard);
    
    AddWard(newWard)
      .then((response) => {
        console.log("Ward added successfully:", response)
        setWards([...wards, newWard]);  
        setIsAddWardModalOpen(false);  
        setShowSuccessPopup(true);  

       
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      })
      .catch((err) => {
        console.error("Error adding ward:", err);  // Handle error
        alert("Error adding ward: " + err);  
      });
  };

  const handleSignUpSubmit = (userData) => {
    setLoading(true);
  
    const hospitalWithUser = {
      ...userData, 
      hospitalName: hospital.name || '', 
    };
    console.log("Hospital with user:", hospitalWithUser);

  };

  const handleRowClick = (record) => {
    console.log("Navigating to:", `/hospital-details/beds?wardId=${record.id}`);
    navigate(`/hospital-details/beds?wardId=${record.id}`);
  };

  // Define the columns for the wards table
  const getColumns = () => [
    { title: 'id', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
  
    { title: 'Created at', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Updated at', dataIndex: 'updatedAt', key: 'updatedAt' },
    { title: 'Is Active', dataIndex: 'isActive', key: 'isActive' },
  ];

  return (
    <div className="ward-dashboard">
      
      {/* Filters Section */}
      <div className="filters-and-actions">
        <div className="ward-title">
          <label>{hospital.name} {'>'} Wards</label>
        </div>

        <div className="filters">
          <div className="filters-title">Filters</div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Search by Ward Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}  // Update search query
            />
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="success-popup">
            <span>✅ Ward added successfully!</span>
          </div>
        )}

       {/* Button to open the Add Ward modal */}
        <button className="add-ward-btn" onClick={() => setIsAddWardModalOpen(true)}>
          Add Ward
        </button> 

        <button className="sign-up-btn" onClick={() => setIsSignUpModalOpen(true)}>
          Sign Up
        </button> 
      </div> 

      {/* Table to display wards */}
      <ReactTable
        columns={getColumns()}
        data={filteredWards}
        rowKey="id"
        config={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' }, // Optional: Add a pointer cursor for better UX
        })}
        className="react-table"
      />

      {/* Add Ward Modal */}
       {isAddWardModalOpen && (
        <AddWardModal
          onClose={() => setIsAddWardModalOpen(false)}
          onSave={handleAddWard}
          hospitalId={hospitalId}
        />
      )} 
       {/* Display the list of wards */}
       <ul>
        {(wards.length && wards || [])?.map((ward, index) => (
          <li key={index}>{ward.wardName}</li>
        ))}
      </ul>
      {isSignUpModalOpen && (
        <SignUpModal
          onClose={() => setIsSignUpModalOpen(false)}
          onSignUpSubmit={handleSignUpSubmit}
          hospitalName={hospital.name}
        />
      )}
    </div>
  );
};

export default WardDashboard;
