import React, { useEffect } from "react";
import AddToQueue from "../components/AddToQueue";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSongs } from "../context/Songs.context";

const Queue = () => {
  const { queueSongs, fetchActiveSession } = useSongs();

  console.log("Renderizando con queueSongs:", queueSongs);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  return (
    <div>
      Queue
      {queueSongs &&
        queueSongs.map((song, index) => (
          <div key={index}>
            <h2>
              {(song.user && song.user.name) ||
                (song.tempUser && song.tempUser.name)}
            </h2>
            <p>{song.name}</p>
          </div>
        ))}
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

export default Queue;
