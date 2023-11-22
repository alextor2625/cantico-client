import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { endSession, getActiveSession } from "../services/session.service";
import TimerSession from "./TimerSession";
import { useSongs } from "../context/Songs.context";
import { io } from "socket.io-client";
import { API_URL } from "../services/config.service";

const EndSession = () => {
  const socket = io.connect(API_URL);

  const {
    seconds,
    toggleSessionStart,
    activeSession,
    setActiveSession,
    timerActive,
    setIsRunning,
  } = useSongs();

  useEffect(() => {
    console.log("timerActive", timerActive);
  }, [timerActive]);

  const handleEndSession = async () => {
    try {
      const sessionData = await getActiveSession();
      if (sessionData && sessionData.session) {
        setActiveSession(sessionData.session);
        const updatedSession = await endSession(
          sessionData.session._id,
          seconds
        );
        console.log("Session ended with updated duration:", updatedSession);
        window.location.reload(false);
      }
    } catch (error) {
      console.error("Error ending the session:", error);
    } finally {
      toggleSessionStart(activeSession._id);
      setIsRunning(false);
      socket.emit("toggleIsRunning", { isRunning: false });
    }
  };

  return (
    <div className="timer-flex">
      <TimerSession />

      <Button
        variant="danger"
        className="end-session"
        onClick={handleEndSession}
      >
        End Session
      </Button>
    </div>
  );
};

export default EndSession;
