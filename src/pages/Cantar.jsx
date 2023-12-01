import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context";

const Cantar = () => {
  const { toggleIsPlaying, isPlaying, queueSongs, fetchActiveSession, currentVideoIndex } = useSongs();
  const { user } = useContext(AuthContext);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  const currentUserId = user?._id;
  const isUserTurn = queueSongs?.findIndex(
    (song) => song.user?._id === currentUserId || song.tempUser?._id === currentUserId
  ) === 0;

  useEffect(() => {
    if (isUserTurn && !isPlaying) {
      setCountdown(30); 
      const intervalId = setInterval(() => {
        setCountdown((currentCountdown) => {
          if (currentCountdown <= 1) {
            clearInterval(intervalId);
            if (!isPlaying) {
              toggleIsPlaying();
            }
            return 0;
          }
          return currentCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isUserTurn, isPlaying, currentVideoIndex]);

  const handlePlayPauseClick = () => {
    if (!isPlaying && isUserTurn) {
      toggleIsPlaying();
    }
  };

  return (
    <div>
      <div className="user-play-btn-cont">
        {isUserTurn && !isPlaying && (
          <div className="queueMessage">{countdown > 0 ? `Tu canción comenzará en: ${countdown}` : "Presiona Play para comenzar"}</div>
        )}
        <Button
          variant="dark"
          className={`user-play-btn ${!isUserTurn ? "disabled" : ""}`}
          onClick={handlePlayPauseClick}
          disabled={!isUserTurn || isPlaying}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        {!isUserTurn && <p>Espera tu turno para cantar.</p>}
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
