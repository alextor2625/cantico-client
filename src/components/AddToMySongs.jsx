import React from 'react';
import { Button } from 'react-bootstrap';
import { getYouTubeVideoDetails } from '../services/youtube.service';

const AddToMySongs = ({ videoId, setVideoDuration }) => {
    const handleAddClick = async () => {
        if (!videoId) {
            console.log('No hay un ID de video proporcionado');
            return;
        }

        try {
            const videoDetails = await getYouTubeVideoDetails(videoId);
            console.log('Detalles del video:', videoDetails);
            if (videoDetails) {
                if (videoDetails.contentDetails) {
                    setVideoDuration(videoDetails.contentDetails.duration);
                }
            }
        } catch (error) {
            console.error('Error al obtener los detalles del video', error);
        }
    };

    return (
        <div>
            <Button onClick={handleAddClick}>Add</Button>
        </div>
    );
};

export default AddToMySongs;
