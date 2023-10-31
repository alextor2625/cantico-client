import React from "react";
import YouTube from "../components/YouTube";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="main-container">
        <YouTube />
      </div>
    </div>
  );
};

export default HomePage;
