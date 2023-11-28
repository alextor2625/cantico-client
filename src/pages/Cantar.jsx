import React from "react";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Cantar = () => {
  return (
    <div>
      Cantar
      <div className="cellphone-viewport">
        <Link to="/mysongs">
          <Button>My Songs</Button>
        </Link>

        <Link to="/cantar">
          <Button>Cantar</Button>
        </Link>

        <Link to="/queue">
          <Button>Queue</Button>
        </Link>
      </div>
    </div>
  );
};

export default Cantar;
