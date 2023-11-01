import React from "react";
import YouTube from "../components/YouTube";
import Navbar from "../components/Navbar";
import LoginPrompt from "../components/LoginPrompt";

const HomePage = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="main-container">
        <YouTube />
        <LoginPrompt />
      </div>
    </div>
  );
};

export default HomePage;
