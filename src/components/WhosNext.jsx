import React, { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";
import { AuthContext } from "../context/auth.context"; // Asegúrate de importar AuthContext
import DeleteMySong from "./DeleteMySong";

const WhosNext = () => {
  const { queueSongs, refreshQueueSongs, activeSession } = useSongs();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (activeSession && activeSession._id) {
      refreshQueueSongs(activeSession._id);
    }
  }, [activeSession, refreshQueueSongs]);

  return (
    <div>
      <Button variant="dark" className="mysongs-btn">
        Queue
      </Button>
      {queueSongs.map((song, index) => {
        console.log("SONG ======>", song);
        return (
          <div
            key={song._id}
            className={`queue-song-item ${index === 0 ? "song-playing" : ""} ${
              index === 1 ? "song-next" : ""
            } ${
              user &&
              !user.admin &&
              ((song.user && song.user._id !== user._id) ||
                (song.tempUser && song.tempUser._id !== user._id)) &&
              index > 1
                ? "default-song"
                : ""
            }`}
          >
            {index === 0 && <p className="song-status">Sonando</p>}
            {index === 1 && <p className="song-status">Siguiente en fila</p>}

            <h3>{song.user && song.user.name  || song.tempUser && song.tempUser.name }</h3>
            <p>{song.name}</p>

            {user &&
              (user.admin || (song.user && song.user._id === user._id)) && (
                <DeleteMySong
                  perfomId={song._id}
                  
                  onRefresh={() => refreshQueueSongs(activeSession._id)}
                />
              )}

            {user &&
              !user.admin &&
              ((song.user && song.user._id === user._id) ||
                (song.tempUser && song.tempUser._id === user._id)) && (
                <DeleteMySong
                  perfomId={song._id}
                  
                  onRefresh={() => refreshQueueSongs(activeSession._id)}
                />
              )}
          </div>
        );
      })}
    </div>
  );
};

export default WhosNext;
