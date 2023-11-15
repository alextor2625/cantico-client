import React, { useEffect } from "react";
import { useSongs } from "../context/Songs.context"; 

const ActiveSession = () => {
    const { activeSession, fetchActiveSession, isLoading, error } = useSongs(); 

    useEffect(() => {
        fetchActiveSession();
    }, [fetchActiveSession]);

    if (isLoading) {
        return <div>Cargando datos de la sesión...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!activeSession) {
        return <div>No hay sesión activa en este momento.</div>;
    }

    return (
        <div>
            <h2 className="session-name">{activeSession.name}</h2>
        </div>
    );
};

export default ActiveSession;
