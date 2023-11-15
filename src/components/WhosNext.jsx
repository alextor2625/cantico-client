import React from 'react';
import { Button } from 'react-bootstrap';
import AddToQueue from './AddToQueue';
import DeleteMySong from './DeleteMySong'; // Asumiendo que tienes este componente
import { useSongs } from '../context/Songs.context';

const WhosNext = () => {
    const { queueSongs, activeSession, refreshSongs } = useSongs();

    // console.log('queueSongs', queueSongs);

    return (
        <div>
            <Button variant="outline-dark">Quién va?</Button>

            <div>
                {queueSongs.map(queue => (
                    <div key={queue._id} className='videos-queue-songs'>
                        <h3>{queue.user.name}</h3>
                        <p>{queue.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhosNext;
