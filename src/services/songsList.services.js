import { API_URL } from "./config.service";
import axios from "axios";

const config = {
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("authToken"),
  },
};

const route = `${API_URL}/songs`;

export const getSongsList = async () => {
  try {
    const response = await axios.get(route, headers);
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};

export const getSongFromList = async (videoId) => {
  try {
    const response = await axios.get(`${route}/${videoId}`, config);
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};

export const searchForSongInList = async (searchTerm) => {
  try {
    const response = await axios.get(`${route}/search/${searchTerm}`, config);
    //console.log("searchForSongInList TESTING", response);
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};

export const addSongToList = async ({
  title = "No Title",
  description = "No Description",
  videoId,
  videoDuration = "Unknown",
  thumbnail = "No Thumbnail",
} = {}) => {
  try {
    const body = { title, description, videoId, videoDuration, thumbnail };
    const response = await axios.post(`${route}/create`, body, config);
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};

export const updateSongOnList = async (
  songId,
  { title, description, videoId, videoDuration, thumbnail } = {}
) => {
  try {
    const body = { title, description, videoId, videoDuration, thumbnail };
    const response = await axios.put(`${route}/update/${songId}`, body, config);
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};

export const deleteSongOnList = async (songId) => {
  try {
    const response = await axios.delete(`${route}/${songId}`, config);
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};


export const cleanUpVideos = async () => {

  const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    };

  try {
    const response = await axios.get(`${route}/cleanupVideos`, config);
    //console.log("clean up videos:", response.data);
    return response.data;
  } catch (error) {
    //console.log("Error:", error);
    //console.log("No se puedo eliminar videos existentes");
  }
};