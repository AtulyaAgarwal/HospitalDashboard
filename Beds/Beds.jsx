import React, { useState, useEffect } from 'react';
import { fetchWardBeds, AddBed} from '../../../helper/BedHelper'; // Replace with your bed helper functions
import ReactTable from '../../../components/ReactTable/ReactTable'; // Reusable table component
import './Beds.css'; // Styling for beds dashboard
import { useLocation , useNavigate } from 'react-router-dom';
import AddBedModal from './AddBedModal'; // Modal for adding beds

const BedDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const wardId = queryParams.get('wardId');
  const [hospital, setHospital] = useState({});
  const [ward, setWard] = useState({});
  const [beds, setBeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (wardId) {
      fetchWardBeds(wardId)
        .then((res) => {
          console.log('Fetched beds:', res.data);
          setBeds(res.data);
          setWard(res['ward']);
          setHospital(res['hospital']);
        })
        .catch((err) => console.error('Error fetching beds:', err));
    } else {
      console.error('No wardId found in query parameters.');
    }
    // const bedsonward = {
    //   wardId,
    //   wardName: ward?.name || '',
    // };
    // console.log("Beds on Ward : ",bedsonward);
  }, [wardId, showSuccessPopup]);

  const filteredBeds = (Array.isArray(beds) ? beds : [])?.filter((bed) => {
    return bed?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  
  
  

  const handleAddBed = (newBed) => {
    console.log('Adding Bed:', newBed);

    AddBed(newBed)
      .then((response) => {
        console.log('Bed added successfully:', response);
        setBeds([...beds, newBed]);
        setIsModalOpen(false);
        setShowSuccessPopup(true);

        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      })
      .catch((err) => {
        console.error('Error adding bed:', err);
        alert('Error adding bed: ' + err);
      });
  };

  const handleRowClick = (record) => {
    console.log("Navigating to:", `/hospital-details/devices?bedId=${record.id}`);
    navigate(`/hospital-details/devices?bedId=${record.id}`);
  };

  const handleTitlesClick = (record) => {
    navigate(`/hospital-details/wards?hospitalId=${record.id}`);
  }

  const getColumns = () => [
    { title: 'id', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Created at', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Updated at', dataIndex: 'updatedAt', key: 'updatedAt' },
    { title: 'Is Active', dataIndex: 'isActive', key: 'isActive' },
  ];

  console.log(">>>", ward)
  return (
    <div className="bed-dashboard">
      
      {/* Filters Section */}
      <div className="filters-and-actions">
        <div className="bed-title">
        <label>
          <span 
            onClick={() => handleTitlesClick(hospital)} 
            style={{ cursor: "pointer"}}
          >
            {hospital?.name || ''}
          </span> {'>'} {ward?.name || ''} {'>'} Beds
        </label>
        </div>
        <div className="filters">
          <div className="filters-title">Filters</div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Search by Bed Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="success-popup">
            <span>✅ Bed added successfully!</span>
          </div>
        )}

        {/* Button to open the Add Bed modal */}
        <button className="add-bed-btn" onClick={() => setIsModalOpen(true)}>
          Add Bed
        </button>
      </div>

      {/* Table to display beds */}
      <ReactTable
            columns={getColumns()}
            data={filteredBeds} // Use filteredBeds instead of beds if filtering is needed
            rowKey="id"
            config={(record) => ({
                onClick: () => handleRowClick(record), // handleRowClick will be used to navigate to the page
                style: { cursor: 'pointer' }, // Add a pointer cursor for better UX
            })}
            className="react-table"
        />


      {/* Add Bed Modal */}
      {isModalOpen && (
        <AddBedModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddBed}
          wardId={wardId}
          wardName={ward.name}  // Pass the ward name to the modal for better user experience
          hospitalName={hospital.name}  // Pass the hospital name to the modal for better user experience
        />
      )}
    </div>
  );
};

export default BedDashboard;
