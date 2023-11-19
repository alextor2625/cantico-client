import React, { useEffect, useState, useContext } from "react";
import { useSongs } from '../context/Songs.context';
import { updatePerfomStatus } from '../services/youtube.service';
import { AuthContext } from '../context/auth.context';

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

  const videoSrc = queueSongs.length > currentVideoIndex
    ? `https://www.youtube.com/embed/${queueSongs[currentVideoIndex].videoId}?autoplay=1&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1&autohide=0`
    : '';

  return (
    <div>
      <iframe
        width="560"
        control="0"
        height="315"
        src={videoSrc}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onEnded={handleVideoEnd}
      ></iframe>

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
