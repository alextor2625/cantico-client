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
    console.log("Line 52 - response", response.data.session);
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

// Edit Session - API ------------------------------------------------

export const editSession = async (sessionId, name, isActive) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  };

  try {
    const response = await axios.put(
      `${API_URL}/sessions/update/${sessionId}`,
      { name: name, isActive: isActive },
      config
    );
    console.log("Line 89 - edit:", response.data);
    return response.data.session; // Asumiendo que 'session' es la clave que contiene la información actualizada.
  } catch (error) {
    console.error("Line 92 - Error:", error);
    // Si hay un mensaje de error en la respuesta, lo mostramos
    if (error.response && error.response.data && error.response.data.message) {
      console.error("API Error:", error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      // Si no hay un mensaje detallado, simplemente lanzamos el error original
      throw error;
    }
  }
};

// Delete Session - API ------------------------------------------------

export const deleteSession = async (sessionId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  };

  try {
    const response = await axios.delete(
      `${API_URL}/sessions/delete/${sessionId}`
    );
    console.log("Line 108 - Deleted Session:", response.data);
    return response.data;
  } catch (error) {
    console.log("Line 111 - Error:", error);
  }
};

// Get the active session - API ------------------------------------------

export const getActiveSession = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  };

  try {
    const response = await axios.get(`${API_URL}/sessions/current/active`);
    // console.log("Active session data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching active session data:", error);
    throw error;
  }
};

// End Session - API ------------------------------------------

export const endSession = async (sessionId, duration) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  };

  try {
    const response = await axios.put(
      `${API_URL}/sessions/end/${sessionId}`,
      { duration: duration },
      config
    );
    console.log("Session ended:", response.data);
    return response.data.session;
  } catch (error) {
    console.error("Error ending session:", error);

    if (error.response && error.response.data && error.response.data.message) {
      console.error("API Error:", error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

// Add User to Session - API ------------------------------------------

export const addUserToSession = async (sessionId, userId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/sessions/add/${userId}`,
      { sessionId },
      config
    );

    console.log("User added to session:", response.data);
    return response.data.session;
  } catch (error) {
    console.error("Error adding user to session:", error.response || error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Error adding user to session");
    }
  }
};

export const toggleSessionStartApi = async (sessionId) => {
  try {
    const response = await axios.put(
      `${API_URL}/sessions/toggle-has-started/${sessionId}`
    );
    console.log("updadte timer:", response.data);
    return response.data;
  } catch (error) {
    console.log("Line 211 - Error:", error);
  }
};
