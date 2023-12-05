import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getYouTubeVideoDetails, addPerfom } from "../services/youtube.service";
import { AuthContext } from "../context/auth.context";
import { useSongs } from "../context/Songs.context"; // Importa el hook del contexto
import { useNavigate } from "react-router-dom";
import { addSongToList } from "../services/songsList.services";

const AddToMySongs = ({ videoId, thumbnails }) => {
  const { user } = useContext(AuthContext);
  const { refreshSongs, setSearchQuery, activeSession, handleAddSong } =
    useSongs(); // Utiliza el hook para acceder a refreshSongs
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user, activeSession);
  }, [user, activeSession]);

  const handleAddClick = async () => {
    if (!videoId) {
      console.log("No hay un ID de video proporcionado");
      return;
    }

    try {
      const videoDetails = await getYouTubeVideoDetails(videoId);
      console.log("ADDING SONG ==>",videoDetails);
      if (videoDetails && videoDetails.contentDetails) {
        const perfomData = {
          name: videoDetails.snippet.title,
          videoDuration: videoDetails.contentDetails.duration,
          videoId: videoId,
          status: "hold",
          user: user._id,
          session: activeSession._id,
          thumbnail: thumbnails,
        };
        console.log("CHECKING THUMBNAILS", thumbnails);
        const savedSongData = {
          title: videoDetails.snippet.title,
          videoDuration: videoDetails.contentDetails.duration,
          description: videoDetails.snippet.description,
          videoId,
          thumbnail: thumbnails
        }

        const savingSong = await addSongToList(savedSongData);
        console.log("SAVING SONG",savingSong);

        await addPerfom(perfomData);
        console.log("Perfom añadido, actualizando canciones...", perfomData);

        setSearchQuery("");
        refreshSongs(activeSession._id);
        handleAddSong()
      }
    } catch (error) {
      console.error(
        "Error al obtener los detalles del video o al añadir perfom",
        error
      );
    }
  };

  return (
    <div>
      <Button onClick={handleAddClick}>Add</Button>
    </div>
  );
};

export default AddToMySongs;
