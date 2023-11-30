import { useContext, useEffect, useState } from "react";
import MySongs from "../components/MySongs";
import YouTubeSearch from "../components/YouTubeSearch";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { ErrorsContext } from "../context/Errors.context";

const MySongsCell = () => {
  const {
    addSong,
    setAddSong,
    activeSession,
    mySongs,
    socket,
    isRunning,
    queueSongs,
  } = useSongs();
  const { queueLimitError, setQueueLimitError } = useContext(ErrorsContext);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (socket) {
      socket.emit("getActiveSession");
      socket.emit("getQueue");
      // socket.emit("update_session")
    }
    console.log(queueLimitError);
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
              <Button className="active-cell">My Songs</Button>
            </Link>

            <Link to="/cantar">
              <Button className="inactive-cell">Cantar</Button>
            </Link>

            <Link to="/queue">
              <Button className="inactive-cell">Queue</Button>
            </Link>
          </>
        )}
      </div>
      {activeSession ? (
        addSong && activeSession ? (
          <YouTubeSearch />
        ) : (
          <>
            <MySongs setSuccess={setSuccess} />
            {success && <div>Added To Queue</div>}
            {errorMessage && <div>{errorMessage}</div>}
          </>
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
      {queueSongs.every(
        (song) =>
          (!song.user || song.user.length < 1) &&
          (!song.tempUser || song.tempUser.length < 1)
      ) && <h1 className="nosongs-queue">No tienes canciones agregadas al la cola.</h1>}
    </div>
  );
};

export default MySongsCell;
