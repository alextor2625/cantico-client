import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { getMySongs, getQueueSongs } from "../services/youtube.service";
import {
  getActiveSession,
  toggleSessionStartApi,
} from "../services/session.service";
import { io } from "socket.io-client";
import { API_URL } from "../services/config.service";

const socket = io.connect(API_URL);

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
  const [addSong, setAddSong] = useState(false)

  const sendSession = (sessionData) => {
    socket.emit("update_session", sessionData);
  };

  const updatedTimer = (timerData) => {
    socket.emit("updated_time", timerData);
  };

  const updateQueue = (queueData) => {
    socket.emit("update_queue", queueData);
  };
  const updatePerform = (performData) => {
    socket.emit("update_perform", performData);
  };
  const toggleIsPlaying = () => {
    !isPlaying ? setIsPlaying(true) : setIsPlaying(false);
  };

  useEffect(() => {
    socket.on("update_session", (updatedSessionData) => {
      setActiveSession(updatedSessionData);
    });

    socket.on("update_queue", (updateQueue) => {
      setQueueSongs(updateQueue);
    });

    socket.on("update_perform", (updatedPerfom) => {
      // console.log("Updating Video Status");
      setIsPlaying(updatedPerfom.isPlaying);
    });

    socket.on("updated_time", (updatedTime) => {
      console.log("Updated Time");
      setTimerActive(updatedTime);
    });
    socket.on("toggleIsRunning", (data) => {
      setIsRunning(data.isRunning);
    });

    return () => {
      socket.off("update_session");
      // socket.off("toggleIsRunning");
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
        sendSession(response.session);
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
  }, []);

  const refreshQueueSongs = useCallback(async (sessionId) => {
    try {
      const response = await getQueueSongs(sessionId);
      if (response.success) {
        setQueueSongs(response.data);
        updateQueue(response.data);
      } else {
        console.log("No se pudo encontrar queue songs");
      }
    } catch (error) {
      console.error("Error al obtener las canciones en cola:", error);
    }
  }, []);

  const toggleSessionStart = useCallback(async (sessionId) => {
    try {
      const updatedSession = await toggleSessionStartApi(sessionId);
      console.log("Timer:", updatedSession.hasStarted);
      if (activeSession) {
        setTimerActive(updatedSession.hasStarted)
      } else {
        setTimerActive(false)
      }
      updatedTimer(updatedSession);

      return updatedSession;
    } catch (error) {
      console.log("Context Line 125:", error);
    }
  });

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
        toggleIsPlaying,
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
      }}
    >
      {children}
    </SongsContext.Provider>
  );
};
