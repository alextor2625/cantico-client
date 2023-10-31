import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom";

const LoginPrompt = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  useEffect(() => {
    modalInstanceRef.current = new bootstrap.Modal(modalRef.current);
    modalInstanceRef.current.show();

    // Limpiar el backdrop al cerrarse
    const handleModalHidden = () => {
      document.body.classList.remove("modal-open");
      const backdrops = document.getElementsByClassName("modal-backdrop");
      while (backdrops.length > 0) {
        backdrops[0].parentNode.removeChild(backdrops[0]);
      }
    };

    modalRef.current.addEventListener("hidden.bs.modal", handleModalHidden);
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener(
          "hidden.bs.modal",
          handleModalHidden
        );
      }
    };
  }, []);

  return (
    <>
      <div className="modal" tabIndex="-1" ref={modalRef} id="loginPromptModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Debes iniciar sesion para agregar canciones.</p>
            </div>
            <div className="modal-footer">
              <Link to="/signup">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => modalInstanceRef.current.hide()}
                >
                  Crear una cuenta
                </button>
              </Link>
              <Link to="/login">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => modalInstanceRef.current.hide()}
                >
                  Iniciar Sesion
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPrompt;
