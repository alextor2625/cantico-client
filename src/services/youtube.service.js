import axios from "axios";
import { API_URL } from "./config.service";

export const searchYouTube = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/youtube/search/videos`, {
        params: { q: query }
      });
      console.log('Line 9 - Youtube Search:', response.data)
      return response.data;
    } catch (error) {
      console.error('Error al realizar la búsqueda en YouTube', error);
      throw error;
    }
  };

  export const getYouTubeVideoDetails = async (videoId) => {
    try {
        const response = await axios.get(`${API_URL}/youtube/video/details`, {
            params: { id: videoId }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles del video de YouTube', error);
        throw error;
    }
};


export const addPerfom = async (perfomData) => {

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
    };

    try {
        const response = await axios.post(`${API_URL}/perform/add-perform`, perfomData, config);
        console.log('Respuesta al añadir perfom:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al añadir perfom', error);
        throw error;
    }
};

export const getMySongs = async (sessionId) => {

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
    };

    try {
        const response = await axios.get(`${API_URL}/perform/my-songs`, {
            params: { sessionId },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("authToken")
            }, config
        });
        console.log('get my songs:', response.data)
        return response.data;
    } catch (error) {
        console.error('Error al obtener mis canciones', error);
        throw error;
    }
};



