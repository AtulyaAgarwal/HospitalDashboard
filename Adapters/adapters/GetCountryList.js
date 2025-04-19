import axios from "axios";

export const GetCountryList = async () => {
  let config = {
    method: "get",
    url: "https://countriesnow.space/api/v0.1/countries/states",
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log(config); // Check if config is correct

  return axios.request(config);
};
