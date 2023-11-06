import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'; // Asegúrate de que estás importando Button de 'react-bootstrap'

const TimerSession = () => {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    
    // Efecto para iniciar el temporizador
    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000); // Cada segundo
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        
        // Limpieza del intervalo
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    // Formatear el tiempo a horas:minutos:segundos
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return [
            hours,
            minutes < 10 ? '0' + minutes : minutes,
            seconds < 10 ? '0' + seconds : seconds,
        ].join(':');
    };

    const toggle = () => {
        setIsActive(!isActive);
    };

    const reset = () => {
        setIsActive(false);
        setSeconds(0);
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
        </div>
    );
};

export default TimerSession;
