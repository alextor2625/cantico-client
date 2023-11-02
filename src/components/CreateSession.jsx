import React, { useState } from "react";
import { addSession } from "../services/session.service";
import { Button } from "react-bootstrap";

const CreateSession = () => {
  const [showAddSession, setShowAddSession] = useState(false);
  const [name, setName] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const toggleAddSession = () => {
    setShowAddSession((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleSessionCreate = (e) => {
    e.preventDefault();
    addSession(
      name,
      (successMessage) => {
        setMessage(successMessage);
        setTimeout(() => {
          setMessage(undefined);
          setShowAddSession(false);
        }, 3000);
        setApiSuccess(true);
        setName("");
      },
      (errorMessage) => {
        setMessage(errorMessage);
        setApiSuccess(false);
        setTimeout(() => {
          setMessage(undefined);
        }, 4000);
      }
    );
  };

  return (
    <div>
      <p className="err-msg danger">{message}</p>
      {showAddSession ? (
        <form onSubmit={handleSessionCreate} className="create-session">
          <div className="create-session-cont">
            <div className="form-floating mb-3">
              <input
                type="name"
                className="form-control"
                id="floatingInput"
                placeholder="Session Name"
                autoComplete="off"
                onChange={handleInputChange}
                value={name}
              />
              <label htmlFor="floatingInput">Session Name</label>
            </div>
          </div>
          <Button type="submit" variant="danger" className="create-btn">
            Create
          </Button>
        </form>
      ) : (
        <Button onClick={toggleAddSession} variant="danger" className="add-session">
          Add Session
        </Button>
      )}
    </div>
  );
};

export default CreateSession;
