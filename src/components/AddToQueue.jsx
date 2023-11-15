import React from 'react';
import { updatePerfomStatus } from '../services/youtube.service';
import { useSongs } from '../context/Songs.context';
import { Button } from 'react-bootstrap';

const AddToQueue = ({ perfomId }) => {
    const { activeSession, refreshSongs, refreshQueueSongs } = useSongs();

    const handleAddToQueueClick = async () => {
        try {
            await updatePerfomStatus(perfomId, activeSession._id);
            // Actualiza ambas listas de canciones
            refreshSongs(activeSession._id);
            refreshQueueSongs(activeSession._id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Button variant="outline-dark" onClick={handleAddToQueueClick}>Añadir a Cola</Button>
        </div>
    );
};

export default AddToQueue;
