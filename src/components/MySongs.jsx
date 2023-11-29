import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DeleteMySong from "./DeleteMySong";
import { useSongs } from "../context/Songs.context";
import AddToQueue from "./AddToQueue";
// import { useHistory } from "react-router-dom";

const MySongs = () => {
  const { mySongs, refreshSongs, activeSession, addSong, setAddSong } =
    useSongs();
  const [showDelete, setShowDelete] = useState(false);

  const handleShowDelete = (songId) => {
    setShowDelete(prevState => ({
      ...prevState,
      [songId]: !prevState[songId]
    }));
  };

//   const history = useHistory()

  // console.log('myysongs', mySongs)

  useEffect(() => {
    if (activeSession && activeSession._id) {
      refreshSongs(activeSession._id);
    }
  }, [activeSession, refreshSongs]);

  const handleAddSong = () => {
    setAddSong((prevState) => !prevState);
  };

  return (
    <div>
      <Button variant="dark" className="mysongs-btn">
        My Songs
      </Button>{" "}
      <div className="queue-songs-holder">
        {mySongs.map((song) => (
          <div key={song._id} className="videos-mysongs">
            <div className="delete-prompt">
              {!showDelete[song._id]? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-x-circle-fill"
                  viewBox="0 0 16 16"
                  onClick={() => handleShowDelete(song._id)}
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-arrow-left-circle-fill"
                  viewBox="0 0 16 16"
                  onClick={() => handleShowDelete(song._id)}
                >
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                </svg>
              )}
            </div>
            <div>
              <img src={song.thumbnail} alt={song.name} />
              {!showDelete[song._id] ? (
                <>
                  <p>{song.name}</p>
                  <AddToQueue perfomId={song._id} />
                </>
              ) : (
                <>
                  <h2>¿Deseas eliminar esta canción?</h2>
                  <DeleteMySong
                    perfomId={song._id}
                    activeSession={activeSession}
                    onRefresh={() => refreshSongs(activeSession._id)}
                  />
                </>
              )}
            </div>
            <hr className="hr-mysongs" />
          </div>
        ))}
      </div>
      <Button onClick={handleAddSong} className="mysongs-name-btn">
        {addSong ? "Seguir Viendo" : "Add Song"}
      </Button>
    </div>
  );
};

export default MySongs;
