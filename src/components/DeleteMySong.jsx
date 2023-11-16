import React from 'react';
import { deleteSong } from '../services/youtube.service';
import { Button } from 'react-bootstrap';
import { useSongs } from '../context/Songs.context'; 

const DeleteMySong = ({ perfomId, activeSession }) => {
    const { refreshSongs, refreshQueueSongs } = useSongs(); 

    const handleDeleteSong = async () => {
        try {
            const response = await deleteSong(perfomId, activeSession._id);
            if (response.success) {
                console.log('Canción eliminada con éxito');
                refreshSongs(activeSession._id);
                refreshQueueSongs(activeSession._id);
            }
        } catch (error) {
            console.error('No se pudo eliminar la canción', error);
        }
    };

    return (
        <div>
            <Button className='delete-queue-btn' onClick={handleDeleteSong}>Remove</Button>
        </div>
    );
};

export default DeleteMySong;
