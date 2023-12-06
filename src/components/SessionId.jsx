import React, { useEffect } from "react";
// import { Button } from "react-bootstrap";
// import qrImage from "../assets/qr-test-2.jpg";
// import { generateCode } from "../services/auth.service";
import QRCode from "qrcode.react";
import { TEST_HOST } from "../services/config.service";
import { useSongs } from "../context/Songs.context";

const SessionId = () => {
  const { code, genNewCode } = useSongs();
  const dataToEncode =
    code && code.data && code.data.genCode
      ? `${TEST_HOST}/signup/${code.data.genCode}`
      : "";

  useEffect(() => {
    genNewCode();
  }, []);
//   console.log("Code:", code);

  return (
    <div className="sessionId-container">
      {/* <img src={qrImage} alt="" className="qr-image" /> */}
      <div className="qr-image" > 
      <QRCode value={dataToEncode} onClick={genNewCode} bgColor="#D4F4FF"/>
      </div>

      <p className="code-intruction">Código de la sesion</p>
      <h4 className="code-session">
        {code ? code.data.genCode : "NOT AVAILABLE"}
      </h4>
    </div>
  );
};

export default SessionId;
