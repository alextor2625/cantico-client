import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "../context/auth.context";
import { logout } from "../services/auth.service";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  // //console.log("Line 10 - isLoggedIn:", isLoggedIn);

  return (
    <div className="navbar-container">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link
            onClick={() => setActiveTab("home")}
            to="/"
            className={activeTab === "home" ? "nav-link active" : "nav-link"}
            aria-current="page"
          >
            Home
          </Link>
        </li>

        {!isLoggedIn && (
          <li className="nav-item">
            <Link
              onClick={() => setActiveTab("login")}
              to="/login"
              className={activeTab === "login" ? "nav-link active" : "nav-link"}
            >
              Log In
            </Link>
          </li>
        )}
        {!isLoggedIn && user && user.admin &&(
          <li className="nav-item">
            <Link
              onClick={() => setActiveTab("signup")}
              to="/signup"
              className={
                activeTab === "signup" ? "nav-link active" : "nav-link"
              }
            >
              Sign Up
            </Link>
          </li>
        )}

        {user && user.admin && (
          <li className="nav-item">
            <Link
              onClick={() => setActiveTab("sessions")}
              to="/sessions"
              className={
                activeTab === "sessions" ? "nav-link active" : "nav-link"
              }
            >
              Sesiones
            </Link>
          </li>
        )}

        {isLoggedIn && (
          <li className="nav-item">
            <Link
              onClick={() => {
                logout();
                setActiveTab("logout");
              }}
              to="/login"
              className={
                activeTab === "logout" ? "nav-link active" : "nav-link"
              }
            >
              Log Out
            </Link>
          </li>
        )}

        <li className="nav-item">
          <Link
            onClick={() => setActiveTab("about")}
            to="/about"
            className={activeTab === "about" ? "nav-link active" : "nav-link"}
            aria-disabled="true"
          >
            About Us
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
