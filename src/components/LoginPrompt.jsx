import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const LoginPrompt = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showPrompt, setShowPromt] = useState(true);
  const { user } = useContext(AuthContext);

  const handleHidePrompt = () => {
    setShowPromt(false);
  };

  console.log("Line 15 - User:", user);

  return (
    <>
      {!isLoggedIn && showPrompt &&(
        <div
          className="modal"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog onChange={handleHidePrompt} centered>
            <Modal.Header closeButton onClick={handleHidePrompt}>
              <Modal.Title>Estas a solo un paso</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>Necesitas iniciar sesion para agregar canciones</p>
            </Modal.Body>

            <Modal.Footer>
              <Link to="/signup">
                <Button variant="secondary" onClick={handleHidePrompt}>
                  No tienes una cuenta?
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="danger">Iniciar Sesion</Button>
              </Link>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
      
      {isLoggedIn && showPrompt &&(
        <div
          className="modal"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog onChange={handleHidePrompt} centered>
            
            {user && user.admin && showPrompt ? (
              <>
              <Modal.Header closeButton onClick={handleHidePrompt}>
              <Modal.Title> Usuario Admin localizado</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>Selecciona debajo que deseas realizar</p>
            </Modal.Body>
              <Modal.Footer>
                <Link to="/signup">
                  <Button variant="secondary" onClick={handleHidePrompt}>
                    Crear una sesion
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="danger">Ver Sesiones anteriores</Button>
                </Link>
              </Modal.Footer>
              </>
            ) : (
              <>
              <Modal.Header closeButton onClick={handleHidePrompt}>
              <Modal.Title> Ya haz iniciado sesion {user && user.name} !</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>Selecciona debajo que deseas realizar</p>
            </Modal.Body>
              <Modal.Footer>
                <Link to="/signup">
                  <Button variant="secondary" onClick={handleHidePrompt}>
                    Mis Canciones
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="danger">Agregar Canciones</Button>
                </Link>
              </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </div>
      )}
    </>
  );
};

export default LoginPrompt;
