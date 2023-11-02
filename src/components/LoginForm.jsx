import React, { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import cantico from "../../public/cantico.png";
import { login, handleInputChange } from "../services/auth.service";
import { AuthContext } from "../context/auth.context";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { setIsLoggedIn, setUser, user } = useContext(AuthContext);

  const navigate = useNavigate();
  const errorMessageTimeoutRef = useRef(null);

  const handleLogInSubmit = (e) => {
    e.preventDefault();
    if (errorMessageTimeoutRef.current) {
      clearTimeout(errorMessageTimeoutRef.current);
    }

    login(email, password, setIsLoggedIn, setUser, (currentUser) => {
      console.log("Line 24 - Current User:", currentUser);
      setUser(currentUser);
      console.log("Line 26 -  User:", user);
      navigate("/");
    }).catch((error) => {
      const errorDescription = error.message;
      setErrorMessage(errorDescription);

      errorMessageTimeoutRef.current = setTimeout(() => {
        setErrorMessage(undefined);
      }, 2000);
    });
  };

  return (
    <>
      <div className="userform-container">
        <div className="logo-title">
          <img src={cantico} alt="logo" className="logo" />
          <h1>Please Log In</h1>
        </div>
        <form onSubmit={handleLogInSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              autoComplete=""
              onChange={handleInputChange(setEmail)}
              value={email}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              autoComplete="current-password"
              onChange={handleInputChange(setPassword)}
              value={password}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button type="submit" className="btn btn-danger">
            Sign In
          </button>
          <Link to="/signup">
            <p>Don't have an account yet?</p>
          </Link>
          <p className="error-message">{errorMessage}</p>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
