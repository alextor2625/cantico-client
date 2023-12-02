import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { queuePerfom } from "../services/youtube.service";
import { useSongs } from "../context/Songs.context";
import { ErrorsContext } from "../context/Errors.context";
import { useNavigate } from "react-router-dom";

const AddToQueue = ({ perfomId, setSuccess }) => {
  const { refreshSongs, activeSession, refreshQueueSongs } = useSongs();
  const { setQueueLimitError, queueLimitError } = useContext(ErrorsContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(activeSession);
    if (queueLimitError) {
      setSuccess(false);
    }
  }, [activeSession, queueLimitError]);
  const handleAddToQueue = async () => {
    try {
      const result = await queuePerfom(perfomId);
      refreshSongs(activeSession._id);
      refreshQueueSongs(activeSession._id);
      setSuccess(true);
      console.log("Perfom actualizado con éxito:", result);
      navigate("/queue");
    } catch (error) {
      setQueueLimitError(error);
      console.error("Error al actualizar el Perfom:", error);
    }
  };

  return (
    <div className="">
      <Button
        variant="outline-dark"
        className="add-queue-btn"
        onClick={handleAddToQueue}
      >
        Add to queue
      </Button>
      <p className="add-queue-prompt">**Click para agregar a la cola**</p>
    </div>
  );
};

export default AddToQueue;
