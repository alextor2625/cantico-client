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