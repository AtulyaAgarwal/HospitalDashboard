import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const AddHospital = async (data) => {
  

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/addHospital`,
        authRequired: true,
        data: data
    };

    console.log(config);  // Check if headers are set correctly

    return axios.request(config);
}
