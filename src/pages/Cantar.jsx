import React, { useEffect, useContext, useState } from "react";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context";

const Cantar = () => {
  const { toggleIsPlaying, isPlaying, fetchActiveSession, countdown, queueSongs } = useSongs();
  const { user } = useContext(AuthContext);
  const [songsBeforeUser, setSongsBeforeUser] = useState(0);
  const [isUserTurn, setIsUserTurn] = useState(false);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession, isPlaying, countdown]);

  useEffect(() => {
    // Determina si es el turno del usuario para cantar
    const isTurn = queueSongs.length > 0 && ((queueSongs[0].user && queueSongs[0].user._id === user._id) || (queueSongs[0].tempUser && queueSongs[0].tempUser._id === user._id));
    setIsUserTurn(isTurn);

    // Calcula cuántas canciones hay antes del turno del usuario
    const userSongIndex = queueSongs.findIndex((song) =>
      song.user ? song.user._id === user._id : song.tempUser && song.tempUser._id === user._id
    );
    
    if (userSongIndex >= 0) {
      // Usuario tiene canciones en la cola, pero no es su turno aún
      setSongsBeforeUser(userSongIndex);
    } else if (!isTurn) {
      // No hay canciones del usuario en la cola y no es su turno
      setSongsBeforeUser(-1);
    }
  }, [queueSongs, user._id]);

  const handlePlayPauseClick = () => {
    if (isUserTurn) {
      toggleIsPlaying();
    }
  };

  let userMessage;
  if (isUserTurn) {
    userMessage = "Es tu turno para cantar.";
  } else if (songsBeforeUser === -1) {
    userMessage = "No tienes canciones en la cola.";
  } else if (songsBeforeUser > 0) {
    userMessage = `Tu turno es en ${songsBeforeUser} canción(es).`;
  } else {
    userMessage = "Espera tu turno para cantar.";
  }

  return (
    <div>
      <div className="user-play-btn-cont">
        {countdown > 0 && isUserTurn && (
          <div className="queueMessage">
            {`Tu canción comenzará en: ${countdown}`}
          </div>
        )}
        <button
          variant="dark"
          className={`user-play-btn ${isUserTurn && countdown ? "" : "disabled"}`}
          onClick={handlePlayPauseClick}
          disabled={!isUserTurn}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <p className="esperatuturno">{userMessage}</p>
      </div>
      {/* Resto del componente */}
    </div>
  );
};

export default Cantar;
