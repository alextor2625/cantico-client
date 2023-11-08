import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { endSession, getActiveSession } from "../services/session.service"; // Importa las funciones necesarias del servicio

const EndSession = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeSession, setActiveSession] = useState(null);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const toggle = () => {
        setIsActive(!isActive);
    };

    const formatTime = (time) => {
        const getSeconds = `0${(time % 60)}`.slice(-2);
        const minutes = `${Math.floor(time / 60)}`;
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    const handleEndSession = async () => {
        if (isActive) {
            toggle(); // Detiene el temporizador si está activo
        }

        try {
            const sessionData = await getActiveSession();
            if (sessionData && sessionData.session) {
                setActiveSession(sessionData.session); // Establece la sesión activa
                const updatedSession = await endSession(sessionData.session._id, seconds);
                console.log("Session ended with updated duration:", updatedSession);
                setSeconds(0); // Restablece el temporizador
                window.location.reload(false)
            }
        } catch (error) {
            console.error("Error ending the session:", error);
        }
    };

    return (
        <div className='timer-flex'>
            <Button onClick={toggle} variant={isActive ? 'light' : 'success'} className='start-stop-btn'>
                {isActive ? 'Stop' : 'Start'}
            </Button>

            <div className="form-floating mb-3 form-live">
                <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="00:00:00"
                    value={formatTime(seconds)}
                    readOnly
                />
                <label htmlFor="floatingInput">Live</label>
            </div>

            <Button variant='danger' className='end-session' onClick={handleEndSession}>
                End Session
            </Button>
        </div>
    );
}

export default EndSession;
