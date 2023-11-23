import React from "react";
import YouTube from "../components/YouTube";
import YouTubeSearch from "../components/YouTubeSearch";
import MySongs from "../components/MySongs";
import WhosNext from "../components/WhosNext";
import ActiveSession from "../components/ActiveSession";
import LiveHolder from "../components/LiveHolder";
import { useSongs } from "../context/Songs.context";
import SessionId from "../components/SessionId";

const StreamingPage = () => {
  const { addSong } = useSongs();

  return (
    <div>
      StreamingPage
      <div className="user-content">
        <ActiveSession />
        <LiveHolder />
      </div>
      <div className="user-controls">
        {addSong ? <YouTubeSearch /> : <YouTube />}

        <SessionId />
        <WhosNext />
      </div>
    </div>
  );
};

export default StreamingPage;
