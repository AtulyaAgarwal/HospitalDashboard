import axios from "axios";
import "../common/axiosInterceptor/axios-interceptor";

export const loginAPI = async (data) => {
    return axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/users/signin`,
        data: data
    })
}
