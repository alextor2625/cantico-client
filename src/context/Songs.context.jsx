import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { API_URL } from "../services/config.service";
import { getMySongs, getQueueSongs } from "../services/youtube.service";
import {
  getActiveSession,
  setSessionHasStartedApi,
  toggleSessionStartApi,
} from "../services/session.service";
import axios from "axios";
import { AuthContext } from "./auth.context";

export const SongsContext = createContext();

export const useSongs = () => useContext(SongsContext);

export const SongsProvider = ({ children }) => {
  const [mySongs, setMySongs] = useState([]);
  const [videoPull, setVideoPull] = useState([])
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
  const [timer, setTimer] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const countdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id;
  const isUserTurn =
    queueSongs?.findIndex(
      (song) =>
        song.user?._id === currentUserId || song.tempUser?._id === currentUserId
    ) === 0;
  // const [addSong, setAddSong] = useState(false)

  useEffect(() => {
    const newSocket = io.connect(API_URL, { withCredentials: true });
    newSocket.on("connect", () => {
      console.log("Socket conectado:", newSocket.connected); // Ahora debería mostrar true
      setSocket(newSocket);
    });

    newSocket.on("update_session", (updatedSessionData) => {
      setActiveSession(updatedSessionData);
    });

    newSocket.on("update_queue", (performs) => {
      // console.log("Evento 'update_queue' recibido:", performs);
      setQueueSongs(performs);
    });

    // newSocket.on("getQueue", () => {
    //   setQueueSongs(updateQueue);
    // });

    newSocket.on("update_perform", (updatedPerfom) => {
      setIsPlaying(updatedPerfom.isPlaying);
    });

    newSocket.on("updated_time", (updatedTime) => {
      setTimerActive(updatedTime);
    });

    newSocket.on("toggleIsRunning", (data) => {
      setIsRunning(data.isRunning);
    });
    newSocket.on("getIsRunning", (data) => {
      setIsRunning(data.isRunning);
    });
    newSocket.on("getActiveSession", (data) => {
      setActiveSession(data.activeSession);
    });

    newSocket.on("toggleIsPlaying", (data) => {
      setIsPlaying(data);
    });

    return () => {
      newSocket.off("update_session");
      newSocket.off("update_queue");
      newSocket.off("update_perform");
      newSocket.off("updated_time");
      newSocket.off("toggleIsRunning");
      newSocket.off("getIsRunning");
      newSocket.off("getActiveSession");
      newSocket.off("toggleIsPlaying");
      // newSocket.off("getQueue");
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
        if (socket) {
          socket.emit("setActiveSession", { activeSession: response.session });
          socket.emit("update_session", response.session);
        }
        return response;
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

  const refreshQueueSongs = useCallback(
    async (sessionId) => {
      try {
        const response = await getQueueSongs(sessionId);
        if (response.success) {
          setQueueSongs(response.data);
          console.log("Datos de la cola recibidos:", response.data);
          // socket.emit("update_queue", { performs: response.data });
          return response;
        } else {
          console.log("No se pudo encontrar queue songs");
        }
      } catch (error) {
        console.error("Error al obtener las canciones en cola:", error);
      }
    },
    [socket, activeSession]
  );

  const toggleSessionStart = useCallback(
    async (sessionId) => {
      try {
        updatedSession = await toggleSessionStartApi(sessionId);
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
    },
    [activeSession, socket]
  );

  const setSessionStart = useCallback(
    async (sessionId, hasStarted) => {
      try {
        const updatedSession = await setSessionHasStartedApi(
          sessionId,
          hasStarted
        );
        console.log("Timer:", updatedSession.hasStarted);
        if (activeSession) {
          setTimerActive(updatedSession.hasStarted);
          setTimer(updatedSession.hasStarted);
        } else {
          setTimerActive(false);
        }
        if (!hasStarted) {
          socket.emit("setActiveSession", { activeSession: null });
        } else {
          socket.emit("setActiveSession", { activeSession: updatedSession });
        }
        socket.emit("updated_time", updatedSession);
      } catch (error) {
        console.log("Context Line 125:", error);
      }
    },
    [activeSession, socket]
  );

  const genNewCode = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/generate-code`);
      setCode(response);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleIsPlaying = () => {
    setIsPlaying((prevState) => {
      const newState = !prevState;
      socket.emit("toggleIsPlaying", newState);
      return newState;
    });
  };

  const handlePlayPauseClick = () => {
    // Cambiar el estado de reproducción cuando se hace clic en el botón
    // console.log('Video Paused:', isPlaying)
    toggleIsPlaying();
  };

  const handleAddSong = () => {
    setAddSong((prevState) => !prevState);
  };

  const startCountdown = useCallback(
    (duration) => {
      if (countdownRef.current) clearInterval(countdownRef.current);

      setCountdown(duration);
      countdownRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownRef.current);
            if (prevCountdown === 1) {
              toggleIsPlaying();
            }
            return null;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    },
    [toggleIsPlaying]
  );

  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCountdown(null);
  }, []);

  useEffect(() => {
    if (isUserTurn && !isPlaying && countdown === null) {
      startCountdown(30);
    } else if (!isUserTurn || isPlaying) {
      stopCountdown();
    }
  }, [isUserTurn, isPlaying, countdown, startCountdown, stopCountdown]);

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
        setSessionStart,
        timerActive,
        addSong,
        setAddSong,
        code,
        setCode,
        genNewCode,
        socket,
        toggleIsPlaying,
        getQueueSongs,
        timer,
        handlePlayPauseClick,
        handleAddSong,
        currentVideoIndex,
        setCurrentVideoIndex,
        countdown,
        setCountdown,
        startCountdown,
        stopCountdown,
        // videoDetails,
        // setVideoDetails,
        videoPull,
        setVideoPull
      }}
    >
      {children}
    </SongsContext.Provider>
  );
};
