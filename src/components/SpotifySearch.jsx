import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { getSongsSpotify } from '../services/spotify.services';


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


            <ListGroup>
                {songs.map((song, index) => (
                    <ListGroup.Item key={index}>
                        {song.name} - {song.artists.map(artist => artist.name).join(', ')}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default SpotifySearch;
