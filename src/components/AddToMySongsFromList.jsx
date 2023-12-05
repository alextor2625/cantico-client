import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth.context';
import { useSongs } from '../context/Songs.context';
import { Button } from 'react-bootstrap';
import { getSongFromList } from '../services/songsList.services';
import { addPerfom } from '../services/youtube.service';

const AddToMySongsFromList = ({ videoId }) => {
    const { user } = useContext(AuthContext);
    const { refreshSongs, setSearchQuery, activeSession, handleAddSong } =
      useSongs(); // Utiliza el hook para acceder a refreshSongs
    // const navigate = useNavigate();
  
    useEffect(() => {
      console.log(user, activeSession);
    }, [user, activeSession]);
  
    const handleAddClick = async () => {
      if (!videoId) {
        console.log("No hay un ID de video proporcionado");
        return;
      }
  
      try {
        const videoDetails = await getSongFromList(videoId)
        if (videoDetails) {
          const perfomData = {
            name: videoDetails.song.title,
            videoDuration: videoDetails.song.videoDuration,
            videoId: videoId,
            status: "hold",
            user: user._id,
            session: activeSession._id,
            thumbnail: videoDetails.song.thumbnail,
          };
          await addPerfom(perfomData);
          console.log("Perform ====>", perfomData);
  
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

export default AddToMySongsFromList