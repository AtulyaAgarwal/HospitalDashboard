import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const signUpHospital = async (formData, hospitalName) => {
    let config = {
        method: "post",
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/cmsSignUp`,
        authRequired: true,
        headers: {
            "Content-Type": "application/json"
        },
        data: { ...formData, hospitalName },
    };

    console.log("Signup Request:", config.data);

    return axios.request(config);
};
