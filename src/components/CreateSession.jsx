import React, { useState, useEffect } from "react";
import { addSession, getActiveSession } from "../services/session.service";
import { Button } from "react-bootstrap";

const CreateSession = ({
  sessionId,
  setSessionId,
  allSessions,
  setAllSessions,
}) => {
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
      (data) => {
        getActiveSession();
        setMessage(data.message);
        setSessionId(data.session._id);
        setTimeout(() => {
          setMessage(undefined);
          window.location.reload(false);
          //   setShowAddSession(false);
        }, 3000);
        setApiSuccess(true);
        setName("");
        setAllSessions((prevSessions) => [...prevSessions, data.session]);
      },
      (errorMessage) => {
        setMessage(errorMessage);
        setApiSuccess(false);
        setTimeout(() => {
          setMessage(undefined);
        }, 4000);
      }
    );
    console.log("Line 45 - sessionId", sessionId);
  };

  useEffect(() => {
    console.log("Actual sessionId:", sessionId);
  }, [sessionId]);

  return (
    <div className="session-fom">
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
        <Button
          onClick={toggleAddSession}
          variant="danger"
          className="add-session"
        >
          Add Session
        </Button>
      )}
    </div>
  );
};

export default CreateSession;
