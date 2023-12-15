import { useContext, useEffect, useState } from "react";
import MySongs from "../components/MySongs";
import YouTubeSearch from "../components/YouTubeSearch";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { ErrorsContext } from "../context/Errors.context";
import { AuthContext } from "../context/auth.context";
import textura from "../assets/textura-2.png";
// import mysongsIcon from "../assets/mysongs-icon.png";

const MySongsCell = () => {
  const {
    addSong,
    setAddSong,
    activeSession,
    mySongs,
    socket,
    isRunning,
    queueSongs,
    handleAddSong,
    fetchActiveSession,
  } = useSongs();
  const { queueLimitError, setQueueLimitError } = useContext(ErrorsContext);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(AuthContext);

  const userSongsInQueue = queueSongs.filter(
    (song) => song.user?._id === user?._id || song.tempUser?._id === user?._id
  ).length;

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession, isRunning]);

  useEffect(() => {
    if (socket) {
      socket.emit("getActiveSession");
      socket.emit("getQueue");
      socket.emit("getIsRunning");
      console.log('Line 42 - MySongsCell isRunning:', isRunning)
    }
    console.log('queuelimiterror:', queueLimitError);
    if (success) {
      const timerId = setTimeout(() => {
        setSuccess(false);
      }, 5000);

      return () => clearTimeout(timerId);
    }
    if (queueLimitError) {
      setErrorMessage(queueLimitError.response.data.message);
      const timerId = setTimeout(() => {
        setQueueLimitError(null);
      }, 10000);

      return () => clearTimeout(timerId);
    } else {
      setErrorMessage("");
    }
  }, [socket, queueLimitError, errorMessage, success]);

  // console.log("activeSession:", activeSession);

  // const handleAddSong = () => {
  //   setAddSong((prevState) => !prevState);
  // };

  return (
    <div>
      
      {!addSong && (

      <h1 className="mysongs-cell-title">My Songs</h1>
      )}
      <div className="cellphone-viewport">
        {activeSession && isRunning && (
          <>
            <Link to="/mysongs" className="mysongs-link">
              <div className="heart-container">
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
              <p className="mysongs-link-text">My Songs</p>
            </Link>

            <Link to="/queue" className="mysongs-link">
              <div className="queue-container-inactive">
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
              <p className="mysongs-link-text">Queue</p>
            </Link>
          </>
        )}
      </div>
      {activeSession ? (
        isRunning ? (
          addSong && activeSession ? (
            <YouTubeSearch />
          ) : (
            <>
              <MySongs setSuccess={setSuccess} />
              {success && <div>Added To Queue</div>}
              {errorMessage && <div className="queuelimit-error">{errorMessage}</div>}
            </>
          )
        ):
          <h1>La sesion esta a punto de comenzar...</h1>
      ) : (
        <h2>No hay Sesion activa</h2>
      )}
      {activeSession && isRunning && (
        <>
          <Button onClick={handleAddSong} className="mysongscell-name-btn">
            {addSong ? "Agregadas" : "Buscar"}
          </Button>
          <img src={textura} alt="textura" className="textura" />
        </>
      )}
      {activeSession && isRunning && mySongs.length === 0 && !addSong && (
        <h1 className="nosongs-queue select-videos-add">
        {userSongsInQueue === 0
          ? "No tienes nada agregado, haz click en buscar para agregar."
          : userSongsInQueue === 1
          ? `Tienes 1 canción agregada, haz click en buscar para agregar más.`
          : `Tienes ${userSongsInQueue} canciones agregadas, haz click en buscar para agregar más.`}
      </h1>
      
      )}
    </div>
  );
};

export default MySongsCell;
