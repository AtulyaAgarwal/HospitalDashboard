import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const GetHospitalWards = async (hospitalId) => {
    let config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/getHospitalWards`,
        authRequired: true,
        data: {
            "hospitalId": hospitalId
        }
    };

    console.log(config); 
     
    

    return axios.request(config);
}
