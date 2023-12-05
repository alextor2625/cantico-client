import React, { useEffect, useContext } from "react";
import AddToQueue from "../components/AddToQueue";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import Cantar from "./Cantar";
import microfono from "../assets/microfono.png";
import DeleteMySong from "../components/DeleteMySong";
import { AuthContext } from "../context/auth.context";

const Queue = () => {
  const {
    queueSongs,
    fetchActiveSession,
    isRunning,
    activeSession,
    socket,
    refreshQueueSongs,
  } = useSongs();
  const { user } = useContext(AuthContext);

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
      {activeSession && isRunning ? ( // Corregido aquí
        <>
          <h2 className="queue-songs-cell-title">Canciones en fila</h2>
          {queueSongs &&
            queueSongs.map((song, index) => (
              <div key={index} className="queue-component-info">
                <h1 className="index-songs">
                  {(index === 0 && (
                    <img
                      src={microfono}
                      alt="icono de microfono"
                      className="microfono-icono"
                    />
                  )) ||
                    index}
                </h1>
                <div className="queue-component-songs">
                  
                  <h2 className="queue-song-name-cell">{song.name}</h2>
                  <div className="delete-user-song-cont">
                    <p className="queue-user-name-cell">
                      {(song.user && song.user.name) ||
                        (song.tempUser && song.tempUser.name)}
                    </p>

                    {((song.user && user && song.user._id === user._id) ||
                      (song.tempUser &&
                        user &&
                        song.tempUser._id === user._id)) && (
                      <DeleteMySong
                        perfomId={song._id}
                        onRefresh={() => refreshQueueSongs(activeSession._id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          <div>
            <Cantar />
          </div>
          <div className="cellphone-viewport">
            {/* <Link to="/mysongs">
              <Button className="inactive-cell">My Songs</Button>
            </Link> */}

            {/* <Link to="/cantar">
              <Button className="inactive-cell">Cantar</Button>
            </Link> */}

            {/* <Link to="/queue">
              <Button className="active-cell">Queue</Button>
            </Link> */}

            <Link to="/mysongs" className="mysongs-link">
              <div className="heart-container-inactive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="#2270E0"
                  className="bi bi-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                  />
                </svg>
              </div>
              <p className="mysongs-link-text-queue">My Songs</p>
            </Link>

            <Link to="/queue" className="mysongs-link">
              <div className="queue-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="#FFFFFF"
                  className="bi bi-stack"
                  viewBox="0 0 16 16"
                >
                  <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z" />
                  <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z" />
                </svg>
              </div>
              <p className="mysongs-link-text-queue">Queue</p>
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
