import React, { useEffect, useState, useContext } from "react";
import { useSongs } from '../context/Songs.context';
import { updatePerfomStatus } from '../services/youtube.service';
import { AuthContext } from '../context/auth.context';
import ReactPlayer from "react-player";

const YouTube = () => {
  const { queueSongs, refreshQueueSongs, activeSession } = useSongs();
  const { user } = useContext(AuthContext);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = async () => {
    if (queueSongs.length > currentVideoIndex) {
      // Actualizar estado a reproducido y cargar siguiente video
      await updatePerfomStatus(queueSongs[currentVideoIndex]._id, { isPlayed: true });
      setCurrentVideoIndex(currentVideoIndex + 1);
      refreshQueueSongs(activeSession._id);
    }
  };

  useEffect(() => {
    if (queueSongs.length > currentVideoIndex) {
      // Marcar el video actual como en reproducción
      updatePerfomStatus(queueSongs[currentVideoIndex]._id, { isPlaying: true });
    }
  }, [queueSongs, currentVideoIndex]);

  const skipToNext = async () => {
    if (queueSongs.length > currentVideoIndex + 1) {
      // Actualizar estado y cargar siguiente video
      await updatePerfomStatus(queueSongs[currentVideoIndex]._id, { isPlayed: true, isPlaying: false });
      setCurrentVideoIndex(currentVideoIndex + 1);
      refreshQueueSongs(activeSession._id);
    }
  };

  const skipToPrevious = async () => {
    if (currentVideoIndex > 0) {
      // Actualizar estado y cargar video anterior
      await updatePerfomStatus(queueSongs[currentVideoIndex]._id, { isPlayed: true, isPlaying: false });
      setCurrentVideoIndex(currentVideoIndex - 1);
      refreshQueueSongs(activeSession._id);
    }
  };

  // Verificar si existe queueSongs[currentVideoIndex] antes de acceder a videoId
  const videoUrl = queueSongs.length > currentVideoIndex && queueSongs[currentVideoIndex]
    ? `https://www.youtube.com/watch?v=${queueSongs[currentVideoIndex].videoId}`
    : '';

  return (
    <div>
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls={false}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1, // Modest Branding
              rel: 0, // No mostrar videos relacionados
              enablejsapi: 1, // Habilitar la API de YouTube
              autohide: 1, // Ocultar la barra de reproducción automáticamente
              showinfo: 0, // No mostrar información del video
              disablekb: 0, // Deshabilitar el teclado
              autoplay: 1, 
            },
          },
        }}
        onEnded={handleVideoEnd}
      />

      {user && user.admin && (
        <div>
          <button onClick={skipToPrevious}>Anterior</button>
          <button onClick={skipToNext}>Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default YouTube;
