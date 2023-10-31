import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, handleInputChange } from "../services/auth.service";
import { useState, useRef } from "react";
import cantico from "../../public/cantico.png";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [admin, setAdmin] = useState(false);

  const navigate = useNavigate();
  const errorMessageTimeoutRef = useRef(null);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (errorMessageTimeoutRef.current) {
      clearTimeout(errorMessageTimeoutRef.current);
    }

    signup(name, lastname, email, telephone, password, admin)
      .then((data) => {
        navigate("/login");
      })
      .catch((error) => {
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
          <h1>Please Sign Up</h1>
        </div>
        <form onSubmit={handleSignupSubmit}>
          <div className="userform-flex">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput1"
                placeholder="Name"
                autoComplete=""
                onChange={handleInputChange(setName)}
                value={name}
              />
              <label htmlFor="floatingInput">Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput2"
                placeholder="Last Name"
                autoComplete=""
                onChange={handleInputChange(setLastName)}
                value={lastname}
              />
              <label htmlFor="floatingInput">Last Name</label>
            </div>
          </div>
          <div className="userform-flex">
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput3"
                placeholder="name@example.com"
                autoComplete=""
                onChange={handleInputChange(setEmail)}
                value={email}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="number"
                className="form-control"
                id="floatingInput4"
                placeholder="Telephone"
                autoComplete=""
                onChange={handleInputChange(setTelephone)}
                value={telephone}
              />
              <label htmlFor="floatingInput">Telephone</label>
            </div>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword1"
              placeholder="Password"
              autoComplete=""
              onChange={handleInputChange(setPassword)}
              value={password}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button type="submit" className="btn btn-danger">
            Creat Account
          </button>
          <Link to="/login">
            <p>Already have an account?</p>
          </Link>
          <p className="error-message">{errorMessage}</p>
        </form>
      </div>
    </>
  );
};

export default SignUpForm;
