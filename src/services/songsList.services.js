import { API_URL } from "./config.service";
import axios from "axios";

const headers = {
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("authToken"),
  },
};

const route = `${API_URL}/songs/`;

export const getSongsList = async () => {
  try {
    const response = await axios.get(route, headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSongFromList = async (songId) => {
  try {
    const response = await axios.get(`${route}/${songId}`, headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addSongToList = async ({
  title = "No Title",
  description = "No Description",
  videoId,
  thumbnailURL = "No Thumbnail",
} = {}) => {
  try {
    const body = { ...headers, title, description, videoId, thumbnailURL };
    const response = await axios.post(`${route}/create`, body);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSongOnList = async (songId, { title, description, videoId, thumbnailURL } = {}) => {
  try {
    const body = { ...headers, title, description, videoId, thumbnailURL };
    const response = await axios.put(`${route}/update/${songId}`, body);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const deleteSongOnList = async (songId) => {
    try {
        const response = await axios.delete
    } catch (error) {
        
    }
}