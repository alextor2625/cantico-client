import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import CreateSession from "../components/CreateSession";
import {
  getAllSessions,
  getSessionID,
  editSession,
  deleteSession,
  getActiveSession,
} from "../services/session.service";
import { Button, Card, Placeholder } from "react-bootstrap";
import ActiveSession from "../components/ActiveSession";
import TimerSession from "../components/TimerSession";

const SessionsPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSessionId, setIsEditingSessionId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [saveChanges, setSaveChanges] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef(null);
  const [deleteSessionId, setDeleteSessionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [noSessionsMessage, setNoSessionsMessage] = useState(null);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${monthNames[monthIndex]}-${day}-${year}`;
  }

  const formattedDate = formatDate("2023-11-03T16:23:22.511Z");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingSessionId]);

  useEffect(() => {
    setIsLoading(true);
    getAllSessions()
      .then((data) => {
        if (
          data.success &&
          (!data.sessionsArr || data.sessionsArr.length === 0)
        ) {
          setNoSessionsMessage(
            "\n\nTan lento utede, tienen que crear mas sesiones 👻 \n\n  Aqui les dejo una lista: \n\n - 🪳 Lunes pa los grillos 🪳 \n\n - 🦄 Marte pa lo venao 🦄 \n\n - 🤫 ''Sali sin permiso'' 🤫 \n\n - 🍺 Los Viernes Jr 🍺\n\n - 💩 Orlando Es Mierda 💩\n\n - 🛩️ Los cueros beben gratis 🛩️ \n\n\n\n"
          );
        } else {
          setAllSessions(data.sessionsArr);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all sessions:", error);
        setIsLoading(false);
      });
  }, [isActive]);

  const handleIsEditing = (sessionId, sessionName) => {
    if (editingSessionId === sessionId) {
      setIsEditingSessionId(null);
    } else {
      setIsEditingSessionId(sessionId);
      setInputValue(sessionName);
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

  const handleDeleteSession = async (sessionId) => {
    setDeleteSessionId(true);

    try {
      await deleteSession(sessionId);
      setDeleteSessionId(false);
      window.location.reload(false);
      setAllSessions((prevSessions) =>
        prevSessions.filter((session) => session._id !== sessionId)
      );
    } catch (error) {
      console.log("Error deleting session:", error);
    }
  };

  const handleSaveChanges = () => {
    setSaveChanges(false);
    setIsEditingSessionId(null);
    getActiveSession();

    const currentSession = allSessions.find(
      (session) => session._id === editingSessionId
    );
    if (currentSession) {
      editSession(currentSession._id, inputValue, currentSession.isActive)
        .then((updatedSession) => {
          setAllSessions((prevSessions) => {
            return prevSessions.map((session) => {
              if (session._id === updatedSession._id) {
                return updatedSession;
              } else {
                return session;
              }
            });
          });
        })
        .catch((error) => {
          // 2. Manejar el error
          console.error("Error editing session:", error);
          setTimeout(() => {
            window.location.reload(false);
          }, 3000);
          setErrorMessage(error.message); // Establecer el mensaje de error en el estado
        });
    }
  };

  const hanldeSetIsActive = () => {
    const updatedSessions = allSessions.map((session) => {
      if (session._id === editingSessionId) {
        console.log("isActive - Antes:", session.name, session.isActive);
        const updatedSession = {
          ...session,
          isActive: !session.isActive,
        };
        console.log(
          "isActive - Despues:",
          session.name,
          updatedSession.isActive
        );
        return updatedSession;
      }
      return session;
    });

    setAllSessions(updatedSessions);
  };

  return (
    <div className="session-full-cont">
      <Navbar />

      <div className="add-session-cont">
        <div className="total-sesiones-cont">
          <h1 className="total-sesiones-titulo">Total:</h1>
          <h2 className="total-sesiones-output">{allSessions.length}</h2>
        </div>
        {!saveChanges && (
          <div className="creat-sess-act">
            <ActiveSession />
            <TimerSession />

            <CreateSession
              sessionId={sessionId}
              setSessionId={setSessionId}
              allSessions={allSessions}
              setAllSessions={setAllSessions}
            />
          </div>
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
            <div className="grid-session-title">
              <h2>All Sessions</h2>
              <h1 className="error-message">{errorMessage}</h1>
              <p className="nosession-message">
                {noSessionsMessage &&
                  noSessionsMessage.split("\n").map((line, index) => {
                    return (
                      <h1 key={index} className="">
                        {line}
                        <br />
                      </h1>
                    );
                  })}
              </p>
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
                          <Card.Text>{formatDate(session.createdAt)}</Card.Text>
                          <Button
                            variant="light"
                            onClick={() =>
                              handleIsEditing(session._id, session.name)
                            }
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
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className={
                                  session.isActive
                                    ? "sessActive"
                                    : "sessInactive"
                                }
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
                            <div className="save-delete">
                              <Button
                                variant="light"
                                onClick={handleSaveChanges}
                              >
                                Save Changes
                              </Button>
                              <Button
                                variant="light"
                                onClick={() => handleDeleteSession(session._id)}
                              >
                                Delete
                              </Button>
                            </div>
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
