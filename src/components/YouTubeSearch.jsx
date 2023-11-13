import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { searchYouTube } from '../services/youtube.service';
import { Button } from 'react-bootstrap';
import AddToMySongs from './AddToMySongs';


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

const YouTubeSearch = ({ activeSession }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [videos, setVideos] = useState([])
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const searchQuery = debouncedSearchTerm + ' karaoke';
            const search = async () => {
                try {
                    const results = await searchYouTube(searchQuery);
                    setVideos(results.items);
                } catch (error) {
                    console.error("Error al buscar en YouTube", error);
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

            <div className='videos-searched-container'>
                {videos.map((video, index) => (
                    <div key={index} className='videos-searched'>
                        <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                        <div className='searched-video-title'>
                            <p className='video-title'>{video.snippet.title}</p>
                            <AddToMySongs videoId={video.id.videoId} activeSession={activeSession} thumbnails={video.snippet.thumbnails.default.url} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouTubeSearch;
