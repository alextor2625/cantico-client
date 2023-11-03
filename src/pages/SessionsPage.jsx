import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CreateSession from "../components/CreateSession";
import {
  getAllSessions,
  getSessionID,
  editSession,
} from "../services/session.service";
import { Button, Card, Placeholder } from "react-bootstrap";

const SessionsPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSessionId, setIsEditingSessionId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [saveChanges, setSaveChanges] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAllSessions()
      .then((sessions) => {
        setAllSessions(sessions.sessionsArr);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all sessions:", error);
        setIsLoading(false);
      });
  }, []);

  const handleIsEditing = (sessionId) => {
    if (editingSessionId === sessionId) {
      setIsEditingSessionId(null);
    } else {
      setIsEditingSessionId(sessionId);
      console.log("setIsEditingSessionID:", sessionId);
    }

    getSessionID(sessionId);
    setSessionId(sessionId);
    console.log("Line 30 - sessionId", sessionId);
    setSaveChanges(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSaveChanges = () => {
    setSaveChanges(false);
    setIsEditingSessionId(null);
    
    editSession(sessionId, inputValue, isActive)
    .then(updatedSession => {
        setAllSessions(prevSessions => {
            return prevSessions.map(session => {
                if (session._id === updatedSession._id) {
                    return updatedSession;
                } else {
                    return session;
                }
            });
        });
    });
};


  const hanldeSetIsActive = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <div>
      <Navbar />

      <div className="add-session-cont">
        <div className="total-sesiones-cont">
          <h1 className="total-sesiones-titulo">Total:</h1>
          <h2 className="total-sesiones-output">{allSessions.length}</h2>
        </div>
        {!sessionId && (
          <CreateSession
            sessionId={sessionId}
            setSessionId={setSessionId}
            allSessions={allSessions}
            setAllSessions={setAllSessions}
          />
        )}
      </div>

      <div className="sessions-container">
        <div>
          {isLoading ? (
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                  <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                  <Placeholder xs={8} />
                </Placeholder>
                <Placeholder.Button variant="primary" xs={6} />
              </Card.Body>
            </Card>
          ) : (
            <div>
              <h2>All Sessions</h2>
              <div className="allsesions-cont">
                {!saveChanges &&
                  [...allSessions].reverse().map((session) => (
                    <div key={session._id}>
                      <Card style={{ width: "18rem" }}>
                        <Card.Body
                          className={
                            session.isActive ? "sessActive" : "sessInactive"
                          }
                        >
                          <Card.Title className="card-title">
                            {session.name}
                          </Card.Title>
                          <Card.Text>
                            {session.isActive ? "Active" : "Inactive"}
                          </Card.Text>
                          <Button
                            variant="light"
                            onClick={() => handleIsEditing(session._id)}
                          >
                            Edit
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}

                {saveChanges &&
                  [...allSessions].reverse().map((session) => (
                    <div key={session._id}>
                      <Card style={{ width: "18rem" }}>
                        <Card.Body
                          className={
                            session.isActive ? "sessActive" : "sessInactive"
                          }
                        >
                          <Card.Title className="card-title">
                            {editingSessionId === session._id ? (
                              <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                              />
                            ) : (
                              session.name
                            )}
                          </Card.Title>
                          <Card.Text className="cardText">
                            {session.isActive ? "Active" : "Inactive"}

                            {editingSessionId === session._id && (
                              <Button
                                onClick={hanldeSetIsActive}
                                variant="light"
                              >
                                {session.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            )}
                          </Card.Text>

                          {editingSessionId === session._id ? (
                            <Button variant="light" onClick={handleSaveChanges}>
                              Save Changes
                            </Button>
                          ) : (
                            <Button variant="light">Edit</Button>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
