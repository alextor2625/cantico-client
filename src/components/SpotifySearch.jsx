import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { getSongsSpotify } from '../services/spotify.services';
import { Button } from 'react-bootstrap';


function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
}

const SpotifySearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [songs, setSongs] = useState([])
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm) {

            const search = async () => {
                try {
                    const results = await getSongsSpotify(debouncedSearchTerm);
                    setSongs(results.tracks.items)
                    console.log(results);
                } catch (error) {
                    console.error("Error al buscar en Spotify", error);

                }
            };

            search();
        }
    }, [debouncedSearchTerm]);

    return (
        <div>
            <Form>
                <Form.Control
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form>


            <div className='songs-searched-container'>
                {songs.map((song, index) => (
                    <div key={index} className='songs-searched'>
                        <img src={song.album.images[0].url} alt={song.name} />
                        <div className='searched-name-title'>
                        <Button variant="secondary" className='add-to-songs'>Add</Button>{' '}
                            <p className='song-artists'>{song.artists.map(artist => artist.name).join(', ')}</p>
                            <p className='song-name'>{song.name} </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpotifySearch;
