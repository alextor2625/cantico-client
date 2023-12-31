import React, { useEffect, useState, useContext } from "react";
import { useSongs } from "../context/Songs.context";
import { updatePerfomStatus } from "../services/youtube.service";
import { AuthContext } from "../context/auth.context";
import ReactPlayer from "react-player";
import { Button } from "react-bootstrap";

const YouTube = ({ hideControls }) => {
  const {
    queueSongs,
    refreshQueueSongs,
    activeSession,
    isPlaying,
    toggleIsPlaying,
    currentVideoIndex,
    setCurrentVideoIndex,
    socket,
    fetchActiveSession,
  } = useSongs();
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isDefaultPlaying, setIsDefaultPlaying] = useState(false);
  const [hasStartedDefaultSongs, setHasStartedDefaultSongs] = useState(false);

  const defaultSongs = [
    {
      name: "Maluma - Hawai",
      videoId: "9Hud4IdhOOE",
    },
    {
      name: "Tony Dize - El doctorado",
      videoId: "LSbeEi2ryeQ",
    },
    {
      name: "A puro dolor - Karaoke",
      videoId: "Ucj4MOkELL4",
    },
    {
      name: "Por amarte asi - Chistian Castro",
      videoId: "hvGT3VVyZZs",
    },
    {
      name: "Rosas - La oreja de vangog",
      videoId: "TAOSwVD2_4o",
    },
  ];

  useEffect(() => {
    // console.log("isPlaying", isPlaying);
  }, [toggleIsPlaying]);

  // useEffect(() => {
  //   fetchActiveSession();
  // }, [fetchActiveSession, isPlaying]);

  // const getQueueSongs = async () => {
  //   try {
  //     const getActiveSessionResponse = await fetchActiveSession();
  //     console.log("RESPONSE SESSION ===> ", getActiveSessionResponse);
  //     const getQueueSongsResponse = await refreshQueueSongs(
  //       getActiveSessionResponse._id
  //     );
  //     console.log("RESPONSE QUEUE ===> ", getQueueSongsResponse);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getQueueSongs();
  // }, []);

  useEffect(() => {
    if (queueSongs) {
      if (
        queueSongs.length === 0 &&
        defaultSongs.length > 0 &&
        !hasStartedDefaultSongs
      ) {
        setCurrentVideoIndex(0);
        setIsDefaultPlaying(true);
        setHasStartedDefaultSongs(true);
        console.log("default songs:", defaultSongs);
      }
    }
  }, [queueSongs, defaultSongs, hasStartedDefaultSongs]);

  const handleVideoEnd = async () => {
    if (queueSongs.length > currentVideoIndex) {
      await updatePerfomStatus(queueSongs[currentVideoIndex]._id, {
        isPlayed: true,
        isPlaying: false,
      });
      setCurrentVideoIndex(currentVideoIndex); // Incrementa el índice
      refreshQueueSongs(activeSession._id);
      setIsDefaultPlaying(false);
    } else if (queueSongs.length === 0) {
      setIsDefaultPlaying(true);
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex + 1) % defaultSongs.length
      ); // Asegura que el índice se mantenga dentro del rango de defaultSongs
    }
    toggleIsPlaying(); // Reanuda la reproducción para la siguiente canción
  };

  const skipToNext = async () => {
    // Asegúrate de que currentVideoIndex apunte a la canción actualmente en reproducción
    if (queueSongs.length > currentVideoIndex + 1) {
      // Marcar la canción actual como reproducida
      await updatePerfomStatus(queueSongs[currentVideoIndex]._id, {
        isPlayed: true,
        isPlaying: false,
      });

      // Incrementar el índice para seleccionar la canción "Siguiente en fila"
      setCurrentVideoIndex(currentVideoIndex);
      refreshQueueSongs(activeSession._id);
    }
  };

  const handlePlayPauseClick = () => {
    toggleIsPlaying();
  };

  useEffect(() => {
    if (queueSongs.length > currentVideoIndex) {
      updatePerfomStatus(queueSongs[currentVideoIndex]._id, {
        isPlaying: isPlaying,
      });

      // console.log("update perform status:", isPlaying);
    }
  }, [queueSongs, currentVideoIndex, isPlaying, activeSession, user]);

  useEffect(() => {
    if (!isDefaultPlaying && queueSongs.length <= currentVideoIndex) {
      setCurrentVideoIndex(Math.max(0, queueSongs.length - 1));
    }
  }, [queueSongs, activeSession, user, isPlaying, isDefaultPlaying]);

  useEffect(() => {
    // Si se añaden canciones a la cola mientras se están reproduciendo las defaultSongs,
    // cambia a la cola y reproduce la primera canción de la cola.
    if (isDefaultPlaying && queueSongs.length > 0) {
      setIsDefaultPlaying(false);
      setHasStartedDefaultSongs(false); // Restablece esto para que puedas volver a defaultSongs más tarde si es necesario
      setCurrentVideoIndex(0); // Cambia a la primera canción de la cola
      toggleIsPlaying(true); // Asegúrate de que se reanude la reproducción
    }
  }, [queueSongs, isDefaultPlaying]);

 

  const skipToPrevious = async () => {
    if (currentVideoIndex > 0) {
      // Actualizar estado y cargar video anterior
      await updatePerfomStatus(queueSongs[currentVideoIndex]._id, {
        isPlayed: true,
        isPlaying: false,
      });
      setCurrentVideoIndex(currentVideoIndex - 1);
      refreshQueueSongs(activeSession._id);
    }
  };

  // Verificar si existe queueSongs[currentVideoIndex] antes de acceder a videoId
  const videoUrl =
    queueSongs && queueSongs.length
      ? `https://www.youtube.com/watch?v=${queueSongs[0].videoId}`
      : `https://www.youtube.com/watch?v=${
          defaultSongs[currentVideoIndex % defaultSongs.length].videoId
        }`;

  if (queueSongs) {
    console.log("Queue Songs:", queueSongs);
    if(queueSongs.length){
      console.log("Current Video Index:", queueSongs[0].name);
    }
    console.log("Current Video Index:", currentVideoIndex);
  }

  const cancionesHastaTurno = () => {
    console.log("Line 91 ===>", queueSongs);
    const proximoTurno = queueSongs.findIndex((song, index) => {
      console.log("Checking IDS ====>", song);
      return (
        index > currentVideoIndex &&
        ((song.user && song.user._id === user._id) ||
          (song.tempUser && song.tempUser._id === user._id))
      );
    });
    console.log("Line 95 ===>", queueSongs);
    return proximoTurno === -1 ? 0 : proximoTurno - currentVideoIndex;
  };

  const mensajeTurno = () => {
    const cantidadCanciones = cancionesHastaTurno();

    if (cantidadCanciones === 0) {
      return "No tienes canciones agregadas en fila";
    } else if (cantidadCanciones === 1) {
      return "Eres el siguiente, ve preparandote, recuerda hacer click en 'Play' cuando estes ready.";
    } else {
      return `Faltan ${cantidadCanciones} turnos para que cantes, aparecerá un botón de play cuando sea tu turno, estate list@`;
    }
  };

  const handleVideoReady = () => {
    setIsLoading(false); // Establecer como falso cuando el video esté listo
  };

  const handleVideoBuffer = () => {
    setIsLoading(true); // Establecer como verdadero cuando el video esté cargando
  };

  return (
    <div>
      {user && user.admin && !hideControls && (
        <div className="video-controls-btns">
          <Button variant="dark" onClick={skipToPrevious}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
          </Button>
          <Button variant="dark" onClick={handlePlayPauseClick}>
            {isPlaying ? <p>Pause</p> : <p>Play</p>}
          </Button>
          <Button variant="dark" onClick={skipToNext}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </Button>
        </div>
      )}
      {/* {console.log(queueSongs[currentVideoIndex])} */}
      {user &&
        !user.admin &&
        queueSongs.length > currentVideoIndex &&
        ((queueSongs[currentVideoIndex].user &&
          queueSongs[currentVideoIndex].user._id === user._id) ||
          (queueSongs[currentVideoIndex].tempUser &&
            queueSongs[currentVideoIndex].tempUser._id === user._id)) && (
          <div className="user-play-btn-cont">
            <Button
              variant="dark"
              className="user-play-btn"
              onClick={handlePlayPauseClick}
            >
              {isPlaying ? <p>Pause</p> : <p>Play</p>}
            </Button>
          </div>
        )}
      {/* {console.log("isPlaying from Youtube.jsx:", isPlaying) } */}
      {user && user.admin && (
        <ReactPlayer
          key={videoUrl}
          url={videoUrl}
          width="100%"
          height={!hideControls ? "100%" : "calc(100vh - 300px)"}
          playing={isPlaying} // Utiliza la prop "playing" para controlar la reproducción
          controls={false}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1, // Modest Branding
                rel: 0, // No mostrar videos relacionados
                enablejsapi: 1, // Habilitar la API de YouTube
                autohide: 0, // Ocultar la barra de reproducción automáticamente
                showinfo: 0, // No mostrar información del video
                disablekb: 0, // Deshabilitar el teclado
                autoplay: 1,
              },
            },
          }}
          onReady={handleVideoReady}
          onBuffer={handleVideoBuffer}
          onEnded={handleVideoEnd}
          className={hideControls ? "" : "adjust-video-size"}
          muted={hideControls ? false : true}
        />
      )}

      {user && !user.admin ? (
        queueSongs.length > currentVideoIndex &&
        ((queueSongs[currentVideoIndex].user &&
          queueSongs[currentVideoIndex].user._id === user._id) ||
          (queueSongs[currentVideoIndex].tempUser &&
            queueSongs[currentVideoIndex].tempUser._id === user._id)) ? (
          <h1>Ya es tu turno de cantar, haz click en "Play" para comenzar</h1>
        ) : (
          <h2>{mensajeTurno()}</h2>
        )
      ) : null}
    </div>
  );
};

export default YouTube;
