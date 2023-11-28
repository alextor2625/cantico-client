import React from "react";
import AddToQueue from "../components/AddToQueue";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Queue = () => {
  return (
    <div>
      Queue
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

export default Queue;
