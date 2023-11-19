import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useSongs } from '../context/Songs.context'; 
import { AuthContext } from '../context/auth.context'; // Asegúrate de importar AuthContext
import DeleteMySong from './DeleteMySong';

const WhosNext = () => {
    const { queueSongs, refreshQueueSongs, activeSession } = useSongs();
    const { user } = useContext(AuthContext); // Obtiene la información del usuario actual

    useEffect(() => {
        if (activeSession && activeSession._id) {
            refreshQueueSongs(activeSession._id); // Actualiza la lista de canciones en cola
        }
    }, [activeSession, refreshQueueSongs]);

    return (
        <div>
            <Button variant="dark" className='mysongs-btn'>Queue</Button>
            <div className='videos-queue-songs'>
                {queueSongs.map(song => (
                    <div key={song._id} className='queue-song-item'>
                        <h3>{song.user.name}</h3>
                        <p>{song.name}</p>
                        {/* Muestra el botón de eliminar solo si el usuario actual es el creador de la canción */}
                        {user && song.user._id === user._id && (
                            <DeleteMySong 
                                perfomId={song._id} 
                                activeSession={activeSession}
                                onRefresh={() => refreshQueueSongs(activeSession._id)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhosNext;
