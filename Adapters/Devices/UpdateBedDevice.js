import axios from "axios";
import "../../common/axiosInterceptor/axios-interceptor";

export const updateBedDevice = async (bedId, monitorId, ventilatorId) => {
  console.log("===== updateBedDevice =====" , bedId, " mid: ", monitorId, " vid: ", ventilatorId)
  const config = {
    method: "post", 
    url: `${process.env.REACT_APP_API_BASE_URL}/admindashboard/api/updateBedDevice`,
    authRequired: true,
    data: {
      "bedId" : bedId,
      "monitorId": monitorId,
      "ventilatorId": ventilatorId ,
    },
  };

  console.log("UpdateBedDevice API Request Config:", config);

  try {
    const response = await axios.request(config);
    console.log("UpdateBedDevice API Response:", response.data.data);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else if (error.request) {
      console.error("No Response:", error.request);
    } else {
      console.error("Request Setup Error:", error.message);
    }
    throw error;
  }
};
