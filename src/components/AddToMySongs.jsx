import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { getYouTubeVideoDetails, addPerfom } from '../services/youtube.service';
import { AuthContext } from '../context/auth.context';
import { useSongs } from '../context/Songs.context'; // Importa el hook del contexto

const AddToMySongs = ({ videoId, activeSession, thumbnails }) => {
    const { user } = useContext(AuthContext);
    const { refreshSongs, setSearchQuery } = useSongs(); // Utiliza el hook para acceder a refreshSongs

    const handleAddClick = async () => {
        if (!videoId) {
            console.log('No hay un ID de video proporcionado');
            return;
        }

        try {
            const videoDetails = await getYouTubeVideoDetails(videoId);
            if (videoDetails && videoDetails.contentDetails) {
                const perfomData = {
                    name: videoDetails.snippet.title,
                    videoDuration: videoDetails.contentDetails.duration,
                    videoId: videoId,
                    status: "hold", 
                    user: user._id,
                    session: activeSession._id,
                    thumbnail: thumbnails
                };

                await addPerfom(perfomData); 
                console.log('Perfom añadido, actualizando canciones...');
                setSearchQuery('');
                refreshSongs(activeSession._id);
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
