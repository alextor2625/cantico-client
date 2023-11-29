import React, { useEffect } from "react";
import MySongs from "../components/MySongs";
import YouTubeSearch from "../components/YouTubeSearch";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";

const MySongsCell = () => {
  const { addSong, setAddSong, activeSession, mySongs, socket, isRunning } =
    useSongs();

  useEffect(() => {
    if (socket) {
      socket.emit("getActiveSession");
      socket.emit("getQueue");
      // socket.emit("update_session")
    }
  }, [socket]);

  console.log("activeSession:", activeSession);

  const handleAddSong = () => {
    setAddSong((prevState) => !prevState);
  };

  return (
    <div>
      MySongs
      <div className="cellphone-viewport">
        {activeSession && isRunning && (
          <>
            <Link to="/mysongs">
              <Button>My Songs</Button>
            </Link>

            <Link to="/cantar">
              <Button>Cantar</Button>
            </Link>

            <Link to="/queue">
              <Button>Queue</Button>
            </Link>
          </>
        )}
      </div>
      {activeSession ? (
        addSong && activeSession ? (
          <YouTubeSearch />
        ) : (
          <MySongs />
        )
      ) : (
        <h2>No hay Sesion activa</h2>
      )}
      {activeSession && !isRunning && (
        <h1>La sesion esta a punto de comenzar...</h1>
      )}
      {activeSession && isRunning && (
        <Button onClick={handleAddSong} className="mysongscell-name-btn">
          {addSong ? "Agregadas" : "Buscar"}
        </Button>
      )}
    </div>
  );
};

export default MySongsCell;
