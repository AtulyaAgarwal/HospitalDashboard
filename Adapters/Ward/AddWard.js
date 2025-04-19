import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const addWard = async (data) => {
  

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/addWard`,
        authRequired: true,
        data: data // Send the data object directly
        
    };

    console.log(config);  


    return axios.request(config);
}
