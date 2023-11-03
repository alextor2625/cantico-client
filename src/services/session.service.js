import { API_URL } from "./config.service";
import axios from "axios";
import { useState } from "react";

// Create Session API ------------------------------------------
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
      onSuccess(response.data);
      console.log("Line 23 - onSuccess:", response.data);
      return response.data;
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

// Get by ID - API ------------------------------------------

export const getSessionID = async (sessionId, onSuccess, onError) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  };

  try {
    const response = await axios.get(`${API_URL}/sessions/${sessionId}`);

    // onSuccess(response);
    console.log("Line 59 - response", response.data.session);
    return response.data.session;
  } catch (error) {
    console.log(error);
    // onError(error);
    // console.log("Line 31 - onError:", error);
  }
};

// Get All Sessions - API ------------------------------------------

export const getAllSessions = async () => {
  try {
    const response = await axios.get(`${API_URL}/sessions/`);
    console.log("Line 65 - getAllSessions:", response.data);
    return response.data;
  } catch (error) {
    console.log("Line 68 - Error:".error);
  }
};
