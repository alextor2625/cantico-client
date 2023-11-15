import React, { createContext, useState, useContext, useCallback } from 'react';
import { getMySongs, getQueueSongs } from '../services/youtube.service';
import { getActiveSession } from '../services/session.service';

export const SongsContext = createContext();

export const useSongs = () => useContext(SongsContext);

export const SongsProvider = ({ children }) => {
    const [mySongs, setMySongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSession, setActiveSession] = useState(null);
    const [queueSongs, setQueueSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshSongs = useCallback(async (sessionId) => {
        try {
            const response = await getMySongs(sessionId);
            if (response.success) {
                console.log('Canciones actualizadas:', response.data);
                setMySongs(response.data);
            } else {
                console.log('No se pudo encontrar my songs');
            }
        } catch (error) {
            console.error('Error al obtener las canciones:', error);
        }
    }, []);

    const fetchActiveSession = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getActiveSession();
          if (response.success) {
            setActiveSession(response.session);
          } else {
            setActiveSession(null);
            setError('No active session found.');
          }
        } catch (error) {
          console.error('Error al obtener la sesión activa:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }, []);

      const refreshQueueSongs = useCallback(async (sessionId) => {
        try {
            const response = await getQueueSongs(sessionId);
            if (response.success) {
                setQueueSongs(response.data); 
            } else {
                console.log('No se pudo encontrar queue songs');
            }
        } catch (error) {
            console.error('Error al obtener las canciones en cola:', error);
        }
    }, []);
      
    

    return (
        <SongsContext.Provider value={{ mySongs, setMySongs, refreshSongs, searchQuery, setSearchQuery, activeSession, setActiveSession, isLoading, error, fetchActiveSession, queueSongs, 
            refreshQueueSongs   }}>
            {children}
        </SongsContext.Provider>
    );
};
