import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { getYouTubeVideoDetails, addPerfom, getMySongs } from '../services/youtube.service';
import { AuthContext } from '../context/auth.context';

const AddToMySongs = ({ videoId, activeSession, thumbnails }) => {
    const [videoName, setVideoName] = useState('')
    const [videoDuration, setVideoDuration] = useState('')
    const { user } = useContext(AuthContext)

    const handleAddClick = async () => {
        if (!videoId) {
            console.log('No hay un ID de video proporcionado');
            return;
        }

        try {
            const videoDetails = await getYouTubeVideoDetails(videoId);
            if (videoDetails && videoDetails.contentDetails) {
                setVideoName(videoDetails.snippet.title);
                setVideoDuration(videoDetails.contentDetails.duration);

                const perfomData = {
                    name: videoDetails.snippet.title,
                    videoDuration: videoDetails.contentDetails.duration,
                    videoId: videoId,
                    status: "hold", 
                    user: user._id,
                    session: activeSession._id,
                    thumbnail: thumbnails
                };

                console.log('Perfom Data:', perfomData)
                const response = await addPerfom(perfomData);
                console.log('Perfom añadido:', response);

                setVideoName('');
                setVideoDuration('');
                getMySongs(activeSession._id)
            }
        } catch (error) {
            console.error('Error al obtener los detalles del video o al añadir perfom', error);
        }
    };

    return (
        <div>
            <Button onClick={handleAddClick}>Add</Button>
        </div>
    );
};

export default AddToMySongs;
