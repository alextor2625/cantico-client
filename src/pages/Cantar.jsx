import React, { useEffect, useContext, useState } from "react";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context";

const Cantar = () => {
  const { toggleIsPlaying, isPlaying, fetchActiveSession, queueSongs } = useSongs();
  const { user } = useContext(AuthContext);
  const [songsBeforeUser, setSongsBeforeUser] = useState(0);
  const [isUserTurn, setIsUserTurn] = useState(false);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  useEffect(() => {
    const isTurn = queueSongs.length > 0 && ((queueSongs[0].user && queueSongs[0].user._id === user._id) || (queueSongs[0].tempUser && queueSongs[0].tempUser._id === user._id));
    setIsUserTurn(isTurn);

    const userSongIndex = queueSongs.findIndex((song) =>
      song.user ? song.user._id === user._id : song.tempUser && song.tempUser._id === user._id
    );
    
    setSongsBeforeUser(userSongIndex >= 0 ? userSongIndex : -1);

    // Asegúrate de que solo se llame a toggleIsPlaying una vez cuando sea el turno del usuario
    if (isTurn && !isPlaying) {
      toggleIsPlaying();
      console.log('toggleisplaying')
    }
  }, [queueSongs, user._id, isPlaying, toggleIsPlaying]);

  const handlePlayPauseClick = () => {
    if (isUserTurn) {
      toggleIsPlaying();
    }
  };

  const getUserMessage = () => {
    if (isUserTurn) {
      return "Es tu turno para cantar.";
    } else if (songsBeforeUser === -1) {
      return "No tienes canciones en la cola.";
    } else {
      return `Tu turno es en ${songsBeforeUser} canción(es).`;
    }
  };

  return (
    <div>
      <div className="user-play-btn-cont">
        <button
          variant="dark"
          className={`user-play-btn cantar-container ${isUserTurn ? "" : "disabled"}`}
          onClick={handlePlayPauseClick}
          disabled={!isUserTurn}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <p className="esperatuturno">{getUserMessage()}</p>
      </div>
    </div>
  );
};

export default Cantar;
