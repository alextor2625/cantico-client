import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import DeleteMySong from './DeleteMySong';
import { useSongs } from '../context/Songs.context';
import { AuthContext } from '../context/auth.context';

const WhosNext = () => {
    const { queueSongs, activeSession, refreshSongs } = useSongs();
    const { user } = useContext(AuthContext)

    return (
        <div>
            <Button variant="outline-dark">Quién va?</Button>

            <div>
                {queueSongs.map(queue => (
                    <div key={queue._id} className={queue.user._id === user._id ? 'videos-queue-songs mysong-queu' : 'videos-queue-songs'}>
                        <h3>{queue.user.name}</h3>
                        <p>{queue.name}</p>

                        {(queue.user._id === user._id || (user && user.admin)) && (
                            <DeleteMySong
                                perfomId={queue._id}
                                activeSession={activeSession}
                                onRefresh={() => refreshSongs(activeSession._id)}
                            />
                        )}

                        <hr />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default WhosNext;

// videos-queue-songs
