import { useContext, useEffect, useState } from "react";
import MySongs from "../components/MySongs";
import YouTubeSearch from "../components/YouTubeSearch";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { ErrorsContext } from "../context/Errors.context";
import { AuthContext } from "../context/auth.context";

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
  }, [fetchActiveSession]);

  useEffect(() => {
    if (socket) {
      socket.emit("getActiveSession");
      socket.emit("getQueue");
      socket.emit("getIsRunning");
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

  // const handleAddSong = () => {
  //   setAddSong((prevState) => !prevState);
  // };

  return (
    <div>
      MySongs
      <div className="cellphone-viewport">
        {activeSession && isRunning && (
          <>
            <Link to="/mysongs">
              <Button className="active-cell">My Songs</Button>
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
      {activeSession && isRunning && mySongs.length === 0 && !addSong && (
        <h1 className="nosongs-queue">
          {userSongsInQueue === 0
            ? "No tienes canciones agregadas, haz click en buscar para agregar mas."
            : `Tienes ${userSongsInQueue} canción(es) agregada(s), haz click en buscar para agregar mas.`}
        </h1>
      )}
    </div>
  );
};

export default MySongsCell;
