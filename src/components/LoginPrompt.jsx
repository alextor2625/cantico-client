import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/auth.context";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { tempSignUp, handleInputChange } from "../services/auth.service";

const LoginPrompt = ({ showPrompt, setShowPrompt }) => {
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");

  const [errorMessage, setErrorMessage] = useState(undefined);
  const { code } = useParams();
  const [signUpCode, setSignUpCode] = useState(code);
  const { setIsLoggedIn, setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const errorMessageTimeoutRef = useRef(null);

  const { isLoggedIn } = useContext(AuthContext);

  // const { user } = useContext(AuthContext);

  const handleHidePrompt = () => {
    setShowPrompt(false);
  };

  const handleTempSubmit = (e) => {
    e.preventDefault();

    tempSignUp(
      name,
      lastname,
      signUpCode,
      setIsLoggedIn,
      setUser,
      (currentUser) => {
        console.log("Line 24 - Current User:", currentUser);
        setUser(currentUser);
      }
    )
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log("Line 15 - User:", user);

  return (
    <>
      {!isLoggedIn && showPrompt &&  (
        <div
          id="modal"
          className="modal"
          style={{ display: "block", position: "initial" }}
        >
          <form action="" method="post" onSubmit={handleTempSubmit}>
            <Modal.Dialog centered>
              <Modal.Header closeButton onClick={handleHidePrompt}>
                <Modal.Title>Estas a solo un paso</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Necesitas escanear el QR para agregar canciones</p>
                <div className="display-flex">
                  <input
                    type="text"
                    placeholder="Nick Name"
                    onChange={handleInputChange(setName)}
                    value={name}
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    onChange={handleInputChange(setLastName)}
                    value={lastname}
                  />
                </div>
                <input
                  type="password"
                  placeholder="Ex: 9A9A9A"
                  onChange={handleInputChange(setSignUpCode)}
                  value={signUpCode}
                  readOnly={signUpCode !== ""} 
                />
              </Modal.Body>

              <Modal.Footer>
                {/* <Link to="/"> */}
                  <Button
                    variant="secondary"
                    // onClick={handleHidePrompt}
                    type="submit"
                  >
                    Submit
                  </Button>
                {/* </Link> */}
                <Link to="/login">
                  <Button variant="danger">-</Button>
                </Link>
              </Modal.Footer>
            </Modal.Dialog>
          </form>
        </div>
      )}

      {isLoggedIn && showPrompt && (
        <div className="modal" style={{ display: "block", position: "fixed" }}>
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
                  <Modal.Title>
                    {" "}
                    Ya haz iniciado sesion {user && user.name} !
                  </Modal.Title>
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
