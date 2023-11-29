import { useContext, useEffect, useState } from "react";
import MySongs from "../components/MySongs";
import YouTubeSearch from "../components/YouTubeSearch";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { ErrorsContext } from "../context/Errors.context";

const MySongsCell = () => {
  const { addSong, setAddSong, activeSession, mySongs, socket } = useSongs();
  const { queueLimitError, setQueueLimitError } = useContext(ErrorsContext);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (socket) {
      socket.emit("getActiveSession");
      socket.emit("getQueue")
      // socket.emit("update_session")
    }
    console.log(queueLimitError);
    if(success){
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
  }, [socket,queueLimitError,errorMessage, success]);

  console.log("activeSession:", activeSession);

  const handleAddSong = () => {
    setAddSong((prevState) => !prevState);
  };

  return (
    <div>
      MySongs
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
      {activeSession ? (
        addSong ? (
          <YouTubeSearch />
        ) : (
          <>
            <MySongs setSuccess={setSuccess}/>
            {success && <div>Added To Queue</div>}
            {errorMessage && <div>{errorMessage}</div>}
          </>
        )
      ) : (
        <h2>No hay Sesion activa</h2>
      )}
      <Button onClick={handleAddSong} className="mysongscell-name-btn">
        {addSong ? "Agregadas" : "Buscar"}
      </Button>
    </div>
  );
};

export default MySongsCell;
