import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { getMySongs } from '../services/youtube.service'

const MySongs = ({ addSong, setAddSong, activeSession }) => {

    const [mySongs, setMySongs] = useState([])


    const handleAddSong = () => {
        setAddSong((prevState) => !prevState)
    }
    useEffect(() => {
        if (activeSession && activeSession._id) {
            getMySongs(activeSession._id)
                .then(response => {
                    console.log('My Songs:', response);
                    if (response.success) {
                        setMySongs(response.data);
                    }
                })
                .catch(error => {
                    console.error('Error al obtener My Songs', error);
                });
        }
    }, [activeSession]);

    console.log('mySongs:', mySongs);

    return (
        <div>
            <Button variant="outline-warning" className='mysongs-btn'>My Songs</Button>{' '}

            <div>
                {mySongs.map((song) => (
                    <div key={song._id} className='videos-mysongs'>
                        <img src={song.thumbnail} alt="" />
                        <p>{song.name}</p>
                        <hr />
                    </div>
                ))}
            </div>

            <Button onClick={handleAddSong}>
                {addSong ? 'Seguir Brechando' : 'Add Song'}
            </Button>
        </div>
    )
}

export default MySongs
