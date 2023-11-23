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
import { useSongs } from "../context/Songs.context";

const HomePage = () => {
  // Handy Things ----------------------

  const { user } = useContext(AuthContext);
  const [sessionId, setSessionId] = useState(null);
  const {
    activeSession,
    setActiveSession,
    isRunning,
    fetchActiveSession,
    timerActive,
    addSong,
    setAddSong,
  } = useSongs();
  // console.log("Before rendering ActiveSession:", typeof setSessionId);

  console.log("Timer Active - Home Page:", timerActive);

  const [showPrompt, setShowPrompt] = useState(true);
  // const [addSong, setAddSong] = useState(false);
  const [videoId, setVideoId] = useState(null);
  // const [activeSession, setActiveSession] = useState(null);
  // console.log("active session", activeSession);
  console.log("isRunnig", isRunning);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  return (
    <div>
      <div className={showPrompt ? "main-content blurred" : "main-content"}>
        <Navbar />
        <div>
          {user && user.admin && (
            <>
              <div className="user-content">
                <ActiveSession
                  activeSession={activeSession}
                  setActiveSession={setActiveSession}
                />
                <LiveHolder />
              </div>

              <div className="user-controls">
                {addSong ? (
                  <YouTubeSearch
                    setVideoId={setVideoId}
                    activeSession={activeSession}
                  />
                ) : (
                  <YouTube />
                )}

                <MySongs />
                <WhosNext />
              </div>
            </>
          )}

          {/* Live Holder & Title - Active Session !Timer*/}

          {user && !user.admin && activeSession && (
            <>
              <div className="user-content">
                <ActiveSession />
                <LiveHolder />
              </div>
            </>
          )}

          {/* Prompts & No hay Active Session */}

          {user && !user.admin && !activeSession && (
            <h1>No hay Sesion Activa en este momento</h1>
          )}

          {/* Actice Sessio === True && !Not Actice */}

          {user && !user.admin && activeSession && !isRunning && (
            <h1>La sesion esta a punto de iniciar...</h1>
          )}

          {/* Active Session && Timer */}

          {user && !user.admin && activeSession && isRunning && (
            <div className="user-controls">
              {addSong ? (
                <YouTubeSearch
                  setVideoId={setVideoId}
                  activeSession={activeSession}
                />
              ) : (
                <YouTube />
              )}

              <MySongs
                addSong={addSong}
                setAddSong={setAddSong}
                activeSession={activeSession}
              />
              <WhosNext />
            </div>
          )}
        </div>
      </div>
      <LoginPrompt showPrompt={showPrompt} setShowPrompt={setShowPrompt} />
    </div>
  );
};

export default HomePage;
