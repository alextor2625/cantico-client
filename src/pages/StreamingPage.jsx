import React, { useEffect } from "react";
import YouTube from "../components/YouTube";
import { useSongs } from "../context/Songs.context";
import SessionId from "../components/SessionId";
import cantico from "../assets/cantico.png";

const StreamingPage = () => {
  const { addSong, queueSongs, isPlaying, fetchActiveSession } = useSongs();

  // useEffect(() => {
  //   console.log("queueSogns", queueSongs);
  // }, [queueSongs, isPlaying]);

  const getQueueSongs = async () => {
    try {
      const getActiveSessionResponse = await fetchActiveSession();
      console.log("RESPONSE SESSION ===> ", getActiveSessionResponse);
      const getQueueSongsResponse = await refreshQueueSongs(getActiveSessionResponse._id)
      console.log("RESPONSE QUEUE ===> ", getQueueSongsResponse);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getQueueSongs();
  }, []);

  return (
    <div className="streaming">
      StreamingPage
      <h1 className="streamin-title">CANTICO</h1>
      <div className="content-blocker">.</div>
    
      <div className="streaming-display">
        <div className="video-size-streaming">
          <YouTube hideControls={true} className="video-yt-streaming" />
        </div>

        <hr />

        <div className="streaming-container">
          <div className="streaming-session-queue">
            <div>
              {queueSongs.map(
                (song, index) =>
                  index === 1 && (
                    <div key={index}>
                      <div className="display-flex">
                        <h4> Siguiente en fila</h4>
                      </div>
                      <p>{song.name}</p>
                      <p>
                        {(song.user && song.user.name) ||
                          (song.tempUser && song.tempUser.name)}
                      </p>
                    </div>
                  )
              )}

              {queueSongs.map((song, index) => {
                if (index === 2 || index === 3 || index === 4) {
                  return (
                    <div key={index}>
                      <div className="display-flex ">
                        <h4>
                          {index}- {song.name}
                        </h4>
                      </div>
                      <p className="streaming-index">
                        {(song.user && song.user.name) ||
                          (song.tempUser && song.tempUser.name)}
                      </p>
                    </div>
                  );
                }
                return null; 
              })}
            </div>
            <SessionId />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingPage;
