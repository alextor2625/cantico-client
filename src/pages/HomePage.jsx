import React, { useContext, useState, useEffect } from "react";
import YouTube from "../components/YouTube";
import Navbar from "../components/Navbar";
import LoginPrompt from "../components/LoginPrompt";
import { AuthContext } from "../context/auth.context";
// import CreateSession from "../components/CreateSession";
import ActiveSession from "../components/ActiveSession";

const HomePage = () => {
  // Handy Things ----------------------

  const { user } = useContext(AuthContext);
  const [sessionId, setSessionId] = useState(null);
  console.log("Before rendering ActiveSession:", typeof setSessionId);

  // Hide & Show ------------------------
  const [showPrompt, setShowPrompt] = useState(true);
  // console.log("user", user);
  // console.log("isAdmin?", user.admin);
  // console.log("sessionId", sessionId);

  return (
    <div>
      <div className={showPrompt ? "main-content blurred" : "main-content"}>
        <Navbar />
        <div>
          {user && user.admin && (
            <div className="admin-content">
              <YouTube />

              <ActiveSession />
            </div>
          )}

          {user && !user.admin && <ActiveSession />}
        </div>
      </div>
      <LoginPrompt showPrompt={showPrompt} setShowPrompt={setShowPrompt} />
    </div>
  );
};

export default HomePage;
