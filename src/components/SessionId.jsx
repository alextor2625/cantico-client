import React from "react";
import { Button } from "react-bootstrap";
import qrImage from "../assets/qr-test.png";

const SessionId = () => {
  return (
    <div className="sessionId-container">
      <Button variant="dark" className="mysongs-btn">
        Unete A la Sesion
      </Button>{" "}
      <img src={qrImage} alt="" className="qr-image"/>

      <p className="code-intruction">Código de la sesion</p>
      <h4 className="code-session">👉🏻 19HG4 👈🏻</h4>
    </div>
  );
};

export default SessionId;
