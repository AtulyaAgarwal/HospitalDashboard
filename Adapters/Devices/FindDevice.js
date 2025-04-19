import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const FindDeviceById = async ({ ventilatorId, monitorId }) => {
    console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

    // Determine which ID is provided
    const data = ventilatorId
        ? { ventilatorId }  // If ventilatorId is provided, send it
        : { monitorId };     // Otherwise, send monitorId

    console.log("Searching with Data:", data);

    let config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/findDeviceById`,
        authRequired: true, 
        data // Send only the relevant ID
    };

    console.log("API Request Config:", config);
    return axios.request(config);
};
