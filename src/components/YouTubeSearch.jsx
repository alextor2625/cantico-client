import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { searchYouTube } from '../services/youtube.service';
import { Button } from 'react-bootstrap';
import AddToMySongs from './AddToMySongs';
import { useSongs } from '../context/Songs.context';

const YouTubeSearch = ({ activeSession }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [videos, setVideos] = useState([]);
    const { searchQuery, setSearchQuery, mySongs, refreshSongs } = useSongs();

    const canAddMoreSongs = mySongs.filter(song => song.status === 'hold').length < 2;

    useEffect(() => {
        // Si se pueden agregar más canciones, y hay videos en la lista, se resetean los videos
        if (!canAddMoreSongs && videos.length > 0) {
            setVideos([]);
        }
    }, [canAddMoreSongs, videos.length]);

    const handleSearch = async () => {
        if (searchQuery) {
            const searchQueryWithKaraoke = searchQuery + 'karaoke';
            try {
                const results = await searchYouTube(searchQueryWithKaraoke);
                setVideos(results.items);
            } catch (error) {
                console.error("Error al buscar en YouTube", error);
            }
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <Form className='youtube-search-bar'>
                <Form.Control
                    type="text"
                    placeholder="Qué deseas cantar?"
                    className="mr-sm-2"
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                {canAddMoreSongs && <Button onClick={handleSearch}>Search</Button>}
            </Form>

            <div className='videos-searched-container'>
                {!canAddMoreSongs && (
                    <div>
                        <h1 className='text-limit'>Límite de canciones agregadas alcanzado</h1>
                        <h3 className='text-limit'>Solo puedes tener dos canciones al mismo tiempo.</h3>
                    </div>
                )}

                {canAddMoreSongs && videos.length === 0 && (
                    <div>
                        <p>Aquí aparecerán los videos que agregues.</p>
                    </div>
                )}

                {canAddMoreSongs && searchQuery && videos.length > 0 && (
                    <div>
                        {videos.map((video, index) => (
                            <div key={index} className='videos-searched'>
                                <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                                <div className='searched-video-title'>
                                    <p className='video-title'>{video.snippet.title}</p>
                                    <AddToMySongs videoId={video.id.videoId} activeSession={activeSession} thumbnails={video.snippet.thumbnails.default.url} onSongAdded={refreshSongs} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default YouTubeSearch;