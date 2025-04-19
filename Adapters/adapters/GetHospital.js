import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const GetHospitals = async () => {
    // let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: `${process.env.REACT_APP_CMS_APP_URL}/cms/api/deviceApi/getAllHospital`,
    //     headers: { 

    //     }
    // };

    // return axios.request(config);


    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/getAllHospital`,
        authRequired: true,
    };

    console.log(config);  // Check if headers are set correctly

    return axios.request(config);
}
