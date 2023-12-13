import React, { useState, useEffect } from "react";
import { updateMaxQueueLimit } from "../services/youtube.service";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { useSongs } from "../context/Songs.context";
const MaxQueueLimitInput = () => {
  const { activeSession, fetchActiveSession } = useSongs();
  // Inicializa maxQueueLimit solo si activeSession no es null
  const [maxQueueLimit, setMaxQueueLimit] = useState(
    activeSession ? activeSession.maxQueueLimit : 1
  );
  useEffect(() => {
   
    if (
      activeSession &&
      maxQueueLimit > 0 &&
      maxQueueLimit !== activeSession.maxQueueLimit
    ) {
      const handleUpdateMaxQueueLimit = async () => {
        try {
          const response = await updateMaxQueueLimit(
            activeSession._id,
            maxQueueLimit
          );
          //console.log("Límite de cola actualizado:", response);
          fetchActiveSession(); 
        } catch (error) {
          console.error("Error al actualizar maxQueueLimit", error);
        }
      };
      handleUpdateMaxQueueLimit();
    }
  }, [maxQueueLimit, activeSession, fetchActiveSession]);
  return (
    <div className="maxqueuelimit-form">
      <Form.Label htmlFor="input-group-dropdown-1">Queue Limit</Form.Label>
      <InputGroup className="mb-3">
        <DropdownButton
          variant="outline-secondary"
          title={maxQueueLimit.toString()}
          id="input-group-dropdown-1"
          onSelect={(e) => setMaxQueueLimit(parseInt(e))}
        >
          <Dropdown.Item eventKey="1">1</Dropdown.Item>
          <Dropdown.Item eventKey="2">2</Dropdown.Item>
          <Dropdown.Item eventKey="3">3</Dropdown.Item>
        </DropdownButton>
      </InputGroup>
    </div>
  );
};
export default MaxQueueLimitInput;
