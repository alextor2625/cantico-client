import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context";

const Cantar = () => {
  const { toggleIsPlaying, isPlaying, queueSongs, fetchActiveSession } =
    useSongs();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  console.log("isPlaying", isPlaying);

  const currentUserId = user?._id;

  console.log("queueSongs:", queueSongs);
  console.log("currentUserId:", currentUserId);

  const userPositionInQueue = queueSongs?.findIndex(
    (song) =>
      song.user?._id === currentUserId || song.tempUser?._id === currentUserId
  );

  console.log("userPositionInQueue:", userPositionInQueue);

  const songsBeforeUser = userPositionInQueue >= 0 ? userPositionInQueue : null;
  const isUserTurn = userPositionInQueue === 0;
  const queueMessage =
    songsBeforeUser > 0
      ? `Faltan ${songsBeforeUser} canciones para cantar`
      : "Ya es tu turno, presiona play cuando estes listo";

  console.log("queueMessage:", queueMessage);

  const handlePlayPauseClick = () => {
    toggleIsPlaying();
  };

  return (
    <div>
      Cantar
      <div className="user-play-btn-cont">
     
        {isUserTurn ? (
          <Button
            variant="dark"
            className="user-play-btn"
            onClick={handlePlayPauseClick}
          >
            {isPlaying ? <p>Pause</p> : <p>Play</p>}
          </Button>
        ) : (
          <div>
            <p>El botón se habilitará cuando sea tu turno.</p>
            <Button
              variant="dark"
              className="user-play-btn disabled"
              onClick={handlePlayPauseClick}
              disabled={true}
            >
              {isPlaying ? <p>Pause</p> : <p>Play</p>}
            </Button>
          </div>
        )}

        {songsBeforeUser !== null && (
          <div className="queueMessage">{queueMessage}</div>
        )}
      </div>
      <div className="cellphone-viewport">
        <Link to="/mysongs">
          <Button>My Songs</Button>
        </Link>
        <Link to="/cantar">
          <Button>Cantar</Button>
        </Link>
        <Link to="/queue">
          <Button>Queue</Button>
        </Link>
      </div>
    </div>
  );
};

export default Cantar;
