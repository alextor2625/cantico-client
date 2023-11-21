import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useSongs } from "../context/Songs.context";
// import { io } from "socket.io-client";
// import { API_URL } from "../services/config.service";

const TimerSession = () => {
  const {
    isRunning,
    setIsRunning,
    startTime,
    setStartTime,
    seconds,
    setSeconds,
    activeSession,
    toggleSessionStart,
  } = useSongs();

//   const socket = io.connect(API_URL);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      if (startTime === null) {
        // Establecer la hora de inicio si es la primera vez que se inicia el temporizador
        setStartTime(Date.now() - seconds * 1000);
      }
      interval = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, seconds, setSeconds]);

  const formatTime = (time) => {
    // Función formatTime
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return [
      hours,
      minutes < 10 ? "0" + minutes : minutes,
      seconds < 10 ? "0" + seconds : seconds,
    ].join(":");
  };

  const toggle = () => {
    if (isRunning || !activeSession) {
      // Detener el temporizador
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      toggleSessionStart(activeSession._id);
      setSeconds(elapsedSeconds);
    } else {
      // Reanudar el temporizador
      setStartTime(Date.now() - seconds * 1000);
    }
    setIsRunning((prevState) => !prevState);
    // const newIsRunning = !isRunning;
    // socket.emit("toggleIsRunning", { isRunning: newIsRunning });
    console.log("isRunning:", isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
  };

  return (
    <div className="timer-flex">
      <Button
        onClick={toggle}
        variant={isRunning ? "light" : "success"}
        className="start-stop-btn"
      >
        {isRunning ? "Stop" : "Start"}
      </Button>
      <div className="form-floating mb-3 form-live">
        <input
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder="00:00:00"
          value={formatTime(seconds)}
          readOnly
        />
        <label htmlFor="floatingInput">Live</label>
      </div>
    </div>
  );
};

export default TimerSession;
