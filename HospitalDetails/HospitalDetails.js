import React from 'react'
import { Outlet } from 'react-router-dom'
import { ROLE } from '../../../enum/role.js'
import { connect } from 'react-redux'


const HospitalDetails = (props) => {
  if (!(props.userRole === ROLE['ADMIN'] || props.userRole === ROLE['PRODUCTION'] || props.userRole === ROLE['SERVICE'])) {
		return (
			  <div>
            <h1>Unauthorized Access</h1>
            <p>You do not have the necessary permissions to access this page.</p>
        </div>
		)
	}
  return (
    <div className='hospital-details-container'>
      <Outlet/>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
      userRole: state.userDetails.userRole
  }
};


const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HospitalDetails);
