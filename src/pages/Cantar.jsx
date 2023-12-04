import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context";

const Cantar = () => {
  const { toggleIsPlaying, isPlaying, fetchActiveSession, countdown } =
    useSongs();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession, isPlaying, countdown]);

  const handlePlayPauseClick = () => {
    if (!isPlaying) {
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
        <button
          variant="dark"
          className={`user-play-btn ${!countdown ? "disabled" : ""}`}
          onClick={handlePlayPauseClick}
          disabled={!isPlaying && countdown !== 0 ? false : true}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        {!countdown && <p className="esperatuturno">Espera tu turno para cantar.</p>}
      </div>
      <div className="cellphone-viewport">
        {/* <Link to="/mysongs">
          <Button className="inactive-cell">My Songs</Button>
        </Link>
        <Link to="/queue">
          <Button className="inactive-cell">Queue</Button>
        </Link> */}
      </div>
    </div>
  );
};

export default Cantar;
