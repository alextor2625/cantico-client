import React, { useEffect } from "react";
import AddToQueue from "../components/AddToQueue";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import Cantar from "./Cantar";

const Queue = () => {
  const { queueSongs, fetchActiveSession, isRunning, activeSession, socket } =
    useSongs();

  // console.log("Renderizando con queueSongs:", queueSongs);

  useEffect(() => {
    fetchActiveSession();

    if (socket) {
      socket.emit("getActiveSession");
      socket.emit("getQueue");
      socket.emit("getIsRunning");
    }
  }, [fetchActiveSession, socket]);

  return (
    <div className="queue-component">
      Queue
      {activeSession && isRunning ? ( // Corregido aquí
        <>
          <h2>Canciones en fila</h2>
          {queueSongs &&
            queueSongs.map((song, index) => (
              <div key={index} className="queue-component-info">
                <h1>
                  {(index === 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      fill="currentColor"
                      className="bi bi-volume-down"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12zM6.312 6.39 8 5.04v5.92L6.312 9.61A.5.5 0 0 0 6 9.5H4v-3h2a.5.5 0 0 0 .312-.11M12.025 8a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8" />
                    </svg>
                  )) ||
                    index}
                </h1>
                <div className="queue-component-songs">
                  <h2>
                    {(song.user && song.user.name) ||
                      (song.tempUser && song.tempUser.name)}
                  </h2>
                  <p>{song.name}</p>
                </div>
              </div>
            ))}
          <div>
            <Cantar />
          </div>
          <div className="cellphone-viewport">
            <Link to="/mysongs">
              <Button className="inactive-cell">My Songs</Button>
            </Link>

            {/* <Link to="/cantar">
              <Button className="inactive-cell">Cantar</Button>
            </Link> */}

            <Link to="/queue">
              <Button className="active-cell">Queue</Button>
            </Link>
          </div>
        </>
      ) : (
        <h1>La sesion esta a punto de comenzar...</h1>
      )}
    </div>
  );
};

export default Queue;
