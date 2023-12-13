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
// import Cantar from "./Cantar";
// import MySongsCell from "./MySongsCell";
// import Queue from "./Queue";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

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
    socket
  } = useSongs();
  // console.log("Before rendering ActiveSession:", typeof setSessionId);

  // console.log("Timer Active - Home Page:", timerActive);

  const [showPrompt, setShowPrompt] = useState(true);
  // const [addSong, setAddSong] = useState(false);
  const [videoId, setVideoId] = useState(null);
  // const [activeSession, setActiveSession] = useState(null);
  // console.log("active session", activeSession);
  // console.log("isRunnig", isRunning);

  // useEffect(() => {
  //   fetchActiveSession();
  // }, [fetchActiveSession]);

  useEffect(() => {
    console.log("Componente de Session/Admin montado");
    fetchActiveSession();
    // console.log("Estado actual de activeSession:", activeSession);
    // Considera si necesitas llamar a refreshQueueSongs aquí
  }, [fetchActiveSession]);
  
  // Continúa con el resto del componente...
  

  useEffect(() => {
    if (socket) {
      socket.emit("getIsRunning");
    }
  },[socket])

  return (
    <div>
      <div className={showPrompt ? "main-content" : "main-content"}>
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
                  <YouTube hideControls={false} />
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

          {/* Actice Session === True && !Not Actice */}

          {user && !user.admin && activeSession && !isRunning && (
            <h1>La sesion esta a punto de iniciar...</h1>
          )}

          {/* Active Session && Timer */}
            {/* {console.log(`${user} && !${user.admin} && ${activeSession} && ${isRunning}`)} */}
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
      <div className="cellphone-homepage">
        {/* {console.log('activeSession:',activeSession)} */}
        {activeSession ? <ActiveSession /> : <h2>No hay sesion activa</h2>}

        <h2>Como agregar canciones?</h2>
      </div>

      <div className="cellphone-viewport">
        {/* <Link to="/mysongs">
          <Button className="inactive-cell">My Songs</Button>
        </Link> */}

        {/* <Link to="/cantar">
          <Button>Cantar</Button>
        </Link> */}

        {/* <Link to="/queue">
          <Button className="inactive-cell">Queue</Button>
        </Link> */}
      </div>
      <LoginPrompt showPrompt={showPrompt} setShowPrompt={setShowPrompt} />
    </div>
  );
};

export default HomePage;
