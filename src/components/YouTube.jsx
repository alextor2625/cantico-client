import React, { useEffect, useState, useContext } from "react";
import { useSongs } from '../context/Songs.context';
import { updatePerfomStatus } from '../services/youtube.service';
import { AuthContext } from '../context/auth.context';
import ReactPlayer from "react-player";
import { Button } from "react-bootstrap";

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

      {user && user.admin && (
        <div className="video-controls-btns">
          <Button variant="dark" onClick={skipToPrevious}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
            </svg>
          </Button>
          <Button variant="dark" onClick={skipToNext}>
          
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
            </svg>
          </Button>
        </div>
      )}


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


    </div>
  );
};

export default YouTube;
