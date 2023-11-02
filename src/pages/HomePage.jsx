import React, { useContext } from "react";
import YouTube from "../components/YouTube";
import Navbar from "../components/Navbar";
import LoginPrompt from "../components/LoginPrompt";
import { AuthContext } from "../context/auth.context";
import CreateSession from "../components/createSession";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="main-container">
        {user && user.admin && (
          <>
            <CreateSession />
            <YouTube />
          </>
        )}

        <LoginPrompt />
      </div>
    </div>
  );
};

export default HomePage;
