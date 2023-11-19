import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import DeleteMySong from './DeleteMySong';
import { useSongs } from '../context/Songs.context'; 
import AddToQueue from './AddToQueue';

const MySongs = ({ addSong, setAddSong }) => {
    const { mySongs, refreshSongs, activeSession } = useSongs(); 

    // console.log('myysongs', mySongs)

    useEffect(() => {
        if (activeSession && activeSession._id) {
            refreshSongs(activeSession._id); 
        }
    }, [activeSession, refreshSongs]); 

    const handleAddSong = () => {
        setAddSong(prevState => !prevState);
    };

    return (
        <div>
            <Button variant="dark" className='mysongs-btn'>My Songs</Button>{' '}

            <div>
                {mySongs.map(song => (
                    <div key={song._id} className='videos-mysongs'>
                        <img src={song.thumbnail} alt={song.name} />
                        <p>{song.name}</p>
                        <div className='delete-add-queu'>
                        <DeleteMySong 
                            perfomId={song._id} 
                            activeSession={activeSession} 
                            onRefresh={() => refreshSongs(activeSession._id)}
                        />
                        <AddToQueue perfomId={song._id} />
                        </div>
                        <hr />
                    </div>
                ))}
            </div>

            <Button onClick={handleAddSong}>
                {addSong ? 'Seguir Brechando' : 'Add Song'}
            </Button>
        </div>
    );
};

export default MySongs;
