import React, { useState, useEffect } from "react";
import { getSessionID } from "../services/session.service";

const ActiveSession = ({ sessionId, setSessionId }) => {
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getSessionID(sessionId)
      .then((data) => {
        if (data && data.isActive) {
          setSessionData(data);
          console.log("Line 20 - Data:", data);
        } else {
          // Si la sesión no está activa, restablecemos el sessionId
          // setSessionId(null);
          setSessionData(!data.isActive); // También limpiamos los datos de la sesión
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sessionId, setSessionId]);

  if (isLoading) {
    return <div>Loading session data...</div>;
  }

  if (error) {
    return (
      <div>Error fetching session data: {error}. Please try again later.</div>
    );
  }

  if (!sessionData) {
    return <div>No hay sesión activa, favor hablar con Orlando Duarte.</div>;
  }

  // Renderizado normal si hay datos de sesión activos
  return (
    <div>
      <h2 className="session-name">{sessionData.name}</h2>
      {/* Aquí puedes mostrar más datos de la sesión como desees */}
    </div>
  );
};

export default ActiveSession;
