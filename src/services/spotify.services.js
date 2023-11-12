import axios from "axios";
import { API_URL } from "./config.service";

export const getSongsSpotify = async (searchQuery) => {
    try {
        const response = await axios.get(`${API_URL}/spotify/search`, {
            params: {
                query: searchQuery
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener canciones de Spotify", error);
        throw error;
    }
};