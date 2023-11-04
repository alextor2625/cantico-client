import React, { useState, useEffect } from "react";
import { getActiveSession } from "../services/session.service";

const ActiveSession = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    // Hacer la llamada al servicio y manejar la promesa con then y catch.
    getActiveSession()
      .then((sessionData) => {
        setActiveSession(sessionData.session); // Asume que sessionData es el objeto de sesión activa
      })
      .catch((err) => {
        setError('Hubo un error al recuperar la sesión activa.');
        console.error(err); // Registrar el error también puede ser útil para el debug
      })
      .finally(() => {
        setIsLoading(false); // Finalizar el indicador de carga independientemente del resultado.
      });
  }, []);

  if (isLoading) {
    return <div>Cargando datos de la sesión...</div>;
  }

  if (error) {
    return (
      <div>
        Todavía no se comienza a cantar, háblense con Orlrandito a ver. Error: {error}
      </div>
    );
  }

  if (!activeSession) {
    return <div>No hay sesión activa, favor hablar con Orlando Duarte.</div>;
  }

  return (
    <div>
      <h2 className="session-name">{activeSession.name}</h2>
    </div>
  );
};

export default ActiveSession;
