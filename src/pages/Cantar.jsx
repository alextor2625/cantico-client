import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context";

const Cantar = () => {
  const {
    toggleIsPlaying,
    isPlaying,
    queueSongs,
    fetchActiveSession,
    currentVideoIndex,
    countdown,
    startCountdown,
    stopCountdown,
  } = useSongs();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  const handlePlayPauseClick = () => {
    if (!isPlaying && countdown === 0) {
      toggleIsPlaying();
    }
  };

  return (
    <div>
      <div className="user-play-btn-cont">
        {countdown > 0 && (
          <div className="queueMessage">
            {`Tu canción comenzará en: ${countdown}`}
          </div>
        )}
        <Button
          variant="dark"
          className={`user-play-btn ${!countdown ? "disabled" : ""}`}
          onClick={handlePlayPauseClick}
          disabled={countdown !== 0 || isPlaying}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        {!countdown && <p>Espera tu turno para cantar.</p>}
      </div>
      <div className="cellphone-viewport">
        <Link to="/mysongs">
          <Button className="inactive-cell">My Songs</Button>
        </Link>
        <Link to="/queue">
          <Button className="inactive-cell">Queue</Button>
        </Link>
      </div>
    </div>
  );
};

export default Cantar;
