import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../services/config.service";
import { getMySongs, getQueueSongs } from "../services/youtube.service";
import { getActiveSession, toggleSessionStartApi } from "../services/session.service";
import axios from "axios";

export const SongsContext = createContext();

export const useSongs = () => useContext(SongsContext);

export const SongsProvider = ({ children }) => {
  const [mySongs, setMySongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queueSongs, setQueueSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timerActive, setTimerActive] = useState(null);
  const [addSong, setAddSong] = useState(false);
  const [code, setCode] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect(API_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("update_session", (updatedSessionData) => {
      setActiveSession(updatedSessionData);
    });

    newSocket.on("update_queue", (updateQueue) => {
      setQueueSongs(updateQueue);
    });

    newSocket.on("update_perform", (updatedPerfom) => {
      setIsPlaying(updatedPerfom.isPlaying);
    });

    newSocket.on("updated_time", (updatedTime) => {
      setTimerActive(updatedTime);
    });

    newSocket.on("toggleIsRunning", (data) => {
      setIsRunning(data.isRunning);
    });

    return () => {
      newSocket.off("update_session");
      newSocket.off("update_queue");
      newSocket.off("update_perform");
      newSocket.off("updated_time");
      newSocket.off("toggleIsRunning");
      newSocket.disconnect();
    };
  }, []);

  const refreshSongs = useCallback(async (sessionId) => {
    try {
      const response = await getMySongs(sessionId);
      if (response.success) {
        setMySongs(response.data);
      } else {
        console.log("No se pudo encontrar my songs");
      }
    } catch (error) {
      console.error("Error al obtener las canciones:", error);
    }
  }, []);

  const fetchActiveSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getActiveSession();
      if (response.success) {
        setActiveSession(response.session);
        socket.emit("update_session", response.session);
      } else {
        setActiveSession(null);
        setError("No active session found.");
      }
    } catch (error) {
      console.error("Error al obtener la sesión activa:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [socket]);

  const refreshQueueSongs = useCallback(async (sessionId) => {
    try {
      const response = await getQueueSongs(sessionId);
      if (response.success) {
        console.log("refreshQueueSongs===========>", response.data);
        setQueueSongs(response.data);
        socket.emit("update_queue", response.data);
      } else {
        console.log("No se pudo encontrar queue songs");
      }
    } catch (error) {
      console.error("Error al obtener las canciones en cola:", error);
    }
  }, [socket]);

  const toggleSessionStart = useCallback(async (sessionId) => {
    try {
      const updatedSession = await toggleSessionStartApi(sessionId);
      console.log("Timer:", updatedSession.hasStarted);
      if (activeSession) {
        setTimerActive(updatedSession.hasStarted);
      } else {
        setTimerActive(false);
      }
      socket.emit("updated_time", updatedSession);
    } catch (error) {
      console.log("Context Line 125:", error);
    }
  }, [activeSession, socket]);

  const genNewCode = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/generate-code`);
      setCode(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SongsContext.Provider
      value={{
        mySongs,
        setMySongs,
        refreshSongs,
        searchQuery,
        setSearchQuery,
        activeSession,
        setActiveSession,
        isLoading,
        error,
        fetchActiveSession,
        queueSongs,
        refreshQueueSongs,
        isPlaying,
        setIsPlaying,
        isRunning,
        setIsRunning,
        seconds,
        setSeconds,
        startTime,
        setStartTime,
        toggleSessionStart,
        timerActive,
        addSong,
        setAddSong,
        code,
        setCode,
        genNewCode,
        socket, // Proporcionar la conexión del socket
      }}
    >
      {children}
    </SongsContext.Provider>
  );
};
