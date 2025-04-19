import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const GetBedMachines = async (bedId) => {
    console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

    let config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/getBedMachines`,
        authRequired: true,
        data: {
            "bedId": bedId 
         }
    };

    console.log(config); 
     
    

    return axios.request(config);
}
