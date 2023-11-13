import React, { useContext, useState, useEffect } from "react";
import YouTube from "../components/YouTube";
import Navbar from "../components/Navbar";
import LoginPrompt from "../components/LoginPrompt";
import { AuthContext } from "../context/auth.context";
// import CreateSession from "../components/CreateSession";
import ActiveSession from "../components/ActiveSession";
import LiveHolder from "../components/LiveHolder";
import MySongs from "../components/MySongs";
import WhosNext from "../components/WhosNext";
import SpotifySearch from "../components/SpotifySearch";
import YouTubeSearch from "../components/YouTubeSearch";

const HomePage = () => {
  // Handy Things ----------------------

  const { user } = useContext(AuthContext);
  const [sessionId, setSessionId] = useState(null);
  console.log("Before rendering ActiveSession:", typeof setSessionId);

  // Hide & Show ------------------------
  const [showPrompt, setShowPrompt] = useState(true);
  const [addSong, setAddSong] = useState(false)
  const [videoId, setVideoId] = useState(null)
  const [activeSession, setActiveSession] = useState(null);
  // const [videoDuratoin, setVideoDuration] = useState(null)
  const [videoStatus, setvideoStatus] = useState('')
  // console.log("user", user);
  // console.log("isAdmin?", user.admin);
  // console.log("sessionId", sessionId);

  return (
    <div>
      <div className={showPrompt ? "main-content blurred" : "main-content"}>
        <Navbar />
        <div>
          {user && user.admin && (
            <div className="admin-content">
              <YouTube />

              <ActiveSession />
            </div>
          )}

          {user && !user.admin && (
            <>
              <div className="user-content">
                <ActiveSession activeSession={activeSession} setActiveSession={setActiveSession} />
                <LiveHolder />
              </div>

              <div className="user-controls">

                {addSong ? <YouTubeSearch setVideoId={setVideoId} activeSession={activeSession} /> : <YouTube />}

                <MySongs addSong={addSong} setAddSong={setAddSong} activeSession={activeSession} />
                <WhosNext />
              </div>
            </>

          )}
        </div>
      </div>
      <LoginPrompt showPrompt={showPrompt} setShowPrompt={setShowPrompt} />
    </div>
  );
};

export default HomePage;
