import React, { useEffect, useState } from 'react';
import "./SideBar.css";
import logo_svg from "../../common/icons/neev_logo.svg";
import ham_burger from "../../common/icons/ham_burger.svg";
import upload_icon from "../../common/icons/upload_version_icon.svg";
import ip_icon from "../../common/icons/globe.svg";
import file_icon from "../../common/icons/file_icon.svg";
import callback from '../../common/icons/callback.svg';
import machine from '../../common/icons/machine.svg';
import addHospitalIcon from '../../common/icons/addhospital.svg';


import { CONTAINER_CONST } from "../../common/constant/common-constants";
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { setActiveIcon } from "../../modules/actions/action";
import { ROLE } from '../../enum/role';

const SideBar = (props) => {
    const navigate = useNavigate();
    const pathName = window.location.pathname;
    if (pathName.includes("machine-details")){
        props.activateOtaDetails();
    }
    else if (pathName.includes("all-system-version-details")){
        props.activateOtaUpload();
    }
    else if (pathName.includes("/ip-log")){
        props.activateIpLog();
    }
    else if (pathName.includes("/request-callback")){
        props.activateRequestCallback();
    }
    else if (pathName.includes("/demo-machine")){
        props.demoMachine();
    } 
    else if (pathName.includes("/hospital-dashboard")) {
        props.activateHospitalDashboard();
    }

    const handleHamburgerOnClick = () => {
        navigate('/ota-details/machine-details/');
        props.activateOtaDetails();
    };

    const handleUploadOnClick = () => {
        navigate('/ota-upload/all-system-version-details/');
        props.activateOtaUpload();
    }

    const handleIpLogClick = () => {
            navigate('/ip-log/');
            props.activateIpLog();
    }
    const handleRequestCallBack = () => {
        navigate('/request-callback/');
        props.activateRequestCallback();
    }
    const handleDemoMachine = () => {
        navigate('/demo-machine/');
        props.demoMachine();
    }
    const handleHospitalDashboardClick = () => {
        navigate('/hospital-details/hospital-dashboard/');
        props.activateHospitalDashboard();
    }
    console.log("userRole>>", props.userRole);
    return (
        <div className="web-sidebar">
            <div className="web-sidebar-icons-container">
                <div className="logo-icon web-sidebar-icon">
                    <img className="sidebar-svg" src={logo_svg} alt="Link Icon" />
                </div>
                {(props.userRole === ROLE['ADMIN'] || props.userRole === ROLE['PRODUCTION'] || props.userRole === ROLE['SERVICE']) &&
                    <div className={`web-sidebar-icon ${props.activeIcon === CONTAINER_CONST.OTA_DETAILS_ACTIVE ? "active_icon_border" : "clickable-icon "} white_border`}>
                        <img className={``} src={ham_burger} alt="Details Link Icon" onClick={() => handleHamburgerOnClick()} />
                    </div>
                }
                {(props.userRole === ROLE['ADMIN']) &&
                    <div className={`upload_icon web-sidebar-icon ${props.activeIcon === CONTAINER_CONST.OTA_UPLOAD_ACTIVE ? "active_icon_border" : "clickable-icon "} white_border`}>
                        <img className={`sidebar-svg`} src={upload_icon} alt=" OTA Link Icon" onClick={() => handleUploadOnClick()} />
                    </div>
                }
                {(props.userRole === ROLE['ADMIN'] || props.userRole === ROLE['PRODUCTION']) &&
                    <div className={`upload_icon web-sidebar-icon ${props.activeIcon === CONTAINER_CONST.IP_LOG_UPLOAD_ACTIVE ? "active_icon_border" : "clickable-icon "} white_border`}>
                        <img className={`sidebar-svg`} src={ip_icon} alt="Ip Link Icon" onClick={() => handleIpLogClick()} />
                    </div>
                }
                {(props.userRole === ROLE['ADMIN'] || props.userRole === ROLE['SERVICE']) &&
                    <div className={`upload_icon web-sidebar-icon ${props.activeIcon === CONTAINER_CONST.REQUEST_CALLBACK ? "active_icon_border" : "clickable-icon "} white_border`}>
                        <img className={`sidebar-svg`} src={callback} alt="Callback Link Icon" onClick={() => handleRequestCallBack()} />
                    </div>
                }
                {(props.userRole === ROLE['ADMIN'] || props.userRole === ROLE['PRODUCTION'] || props.userRole === ROLE['SERVICE']) &&
                    <div className={`upload_icon web-sidebar-icon ${props.activeIcon === CONTAINER_CONST.DEMO_MACHINE ? "active_icon_border" : "clickable-icon "} white_border`}>
                        <img className={`sidebar-svg`} src={machine} alt="Machine Link Icon" onClick={() => handleDemoMachine()} />
                    </div>
                }
                {/* Hospital Dashboard Icon */}
                {(props.userRole === ROLE['ADMIN'] || props.userRole === ROLE['SERVICE']) &&
                    <div className={`upload_icon web-sidebar-icon ${props.activeIcon === CONTAINER_CONST.HOSPITAL_DASHBOARD ? "active_icon_border" : "clickable-icon "} white_border`}>
                        <img className={`sidebar-svg`} src={addHospitalIcon} alt="Hospital Dashboard Icon" onClick={() => handleHospitalDashboardClick()} />
                    </div>
                }
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        activeIcon: state.activeIcon.activeSideBarIcon,
        userRole: state.userDetails.userRole
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        activateOtaDetails: () => dispatch(setActiveIcon(CONTAINER_CONST.OTA_DETAILS_ACTIVE)),
        activateOtaUpload: () => dispatch(setActiveIcon(CONTAINER_CONST.OTA_UPLOAD_ACTIVE)),
        activateIpLog: () => dispatch(setActiveIcon(CONTAINER_CONST.IP_LOG_UPLOAD_ACTIVE)),
        activateRequestCallback: () => dispatch(setActiveIcon(CONTAINER_CONST.REQUEST_CALLBACK)),
        demoMachine: () => dispatch(setActiveIcon(CONTAINER_CONST.DEMO_MACHINE)),
        activateHospitalDashboard: () => dispatch(setActiveIcon(CONTAINER_CONST.HOSPITAL_DASHBOARD)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);