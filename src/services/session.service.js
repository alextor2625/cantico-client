import { API_URL } from "./config.service";
import axios from "axios";

export const addSession = async (name, onSuccess, onError) => {
  const requestBody = { name };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/sessions/create`,
      requestBody,
      config
    );
    console.log(response.data);
    if (response.data.success) {
      onSuccess(response.data.message);
      console.log("Line 23 - onSuccess:", response.data.message);
    } else {
      onError(response.data.message);
      console.log("Line 26 - onError:", response.data.message);
    }
  } catch (error) {
    console.log("Line 10 - Error:", error);
    onError(error.response.data.message);
    console.log("Line 31 - onError:", error.response.data.message);
  }
};
