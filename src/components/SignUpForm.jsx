import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tempSignUp, handleInputChange } from "../services/auth.service";
import cantico from "../assets/cantico.png";
import { AuthContext } from "../context/auth.context";
import { useSongs } from "../context/Songs.context";

const SignUpForm = () => {
  // Definición de estados y lógica similar a LoginPrompt
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { code } = useParams();
  const [signUpCode, setSignUpCode] = useState(code);
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const errorMessageTimeoutRef = useRef(null);
  const { handleAddSong } = useSongs();

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    tempSignUp(
      name,
      lastname,
      signUpCode,
      setIsLoggedIn,
      setUser,
      (currentUser) => {
        console.log("Current User:", currentUser);
        setUser(currentUser);
      }
    )
      .then((data) => {
        navigate("/mysongs");
        handleAddSong()
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="userform-container">
      <div className="logo-title">
        <img src={cantico} alt="logo" className="logo" />
        <h1>Please Sign Up</h1>
      </div>
      <form onSubmit={handleSignupSubmit}>
        <div className="userform-flex">
          <input
            type="text"
            placeholder="Nick Name"
            onChange={handleInputChange(setName)}
            value={name}
          />
          <input
            type="text"
            placeholder="Apellido"
            onChange={handleInputChange(setLastName)}
            value={lastname}
          />
          <input
            type="password"
            placeholder="Ex: 9A9A9A"
            onChange={handleInputChange(setSignUpCode)}
            value={signUpCode}
            readOnly={signUpCode !== ""}
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Create Account
        </button>
        {/* <Link to="/login">
          <p>Already have an account?</p>
        </Link> */}
        <p className="error-message">{errorMessage}</p>
      </form>
    </div>
  );
};

export default SignUpForm;
