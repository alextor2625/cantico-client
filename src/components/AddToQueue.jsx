import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { queuePerfom } from '../services/youtube.service';
import { useSongs } from '../context/Songs.context'; 

const AddToQueue = ({ perfomId }) => {

    const { refreshSongs, activeSession, refreshQueueSongs } = useSongs(); 
    useEffect(() => {
        console.log(activeSession);
    },[activeSession])
    const handleAddToQueue = async () => {
        try {
            const result = await queuePerfom(perfomId);
            refreshSongs(activeSession._id)
            refreshQueueSongs(activeSession._id);
            console.log("Perfom actualizado con éxito:", result);
        } catch (error) {
            console.error("Error al actualizar el Perfom:", error);
        }
    };

    return (
        <div>
            <Button variant="outline-dark" onClick={handleAddToQueue}>Queue</Button>
        </div>
    );
};

export default AddToQueue;
