import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import DeleteMySong from './DeleteMySong';
import { useSongs } from '../context/Songs.context'; // Importa el hook del contexto

const MySongs = ({ addSong, setAddSong, activeSession }) => {
    const { mySongs, refreshSongs } = useSongs(); // Utiliza el hook para acceder a mySongs y refreshSongs

    useEffect(() => {
        if (activeSession && activeSession._id) {
            refreshSongs(activeSession._id); // Actualiza la lista de canciones al cargar el componente
        }
    }, [activeSession, refreshSongs]); // Asegúrate de incluir refreshSongs como dependencia

    const handleAddSong = () => {
        setAddSong(prevState => !prevState);
    };

    return (
        <div>
            <Button variant="outline-warning" className='mysongs-btn'>My Songs</Button>{' '}

            <div>
                {mySongs.map(song => (
                    <div key={song._id} className='videos-mysongs'>
                        <img src={song.thumbnail} alt={song.name} />
                        <p>{song.name}</p>
                        <DeleteMySong 
                            perfomId={song._id} 
                            activeSession={activeSession} 
                            onRefresh={() => refreshSongs(activeSession._id)}
                        />
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
