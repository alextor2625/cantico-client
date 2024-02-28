import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tempSignUp, handleInputChange } from "../services/auth.service";
import cantico from "../assets/cantico-black-white.png";
import { AuthContext } from "../context/auth.context";
import { useSongs } from "../context/Songs.context";
import signUpFooter from "../assets/signup-footer.png"

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
        handleAddSong();
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
        <h1 className="signup-title">SIGN UP</h1>
      </div>
      <form onSubmit={handleSignupSubmit}>
        <div className="userform-flex form-floating mb-3">
          <input
            type="text"
            placeholder="Nick Name"
            id="floatingInputNickName"
            onChange={handleInputChange(setName)}
            value={name}
            className="signup-input form-control"
          />
          <label htmlFor="floatingInputNickName">NICKNAME</label>
        </div>
        {/* <div className="form-floating">
          <input
            type="text"
            placeholder="Apellido"
            id="floatingInputLastName"
            onChange={handleInputChange(setLastName)}
            value={lastname}
            className="signup-input form-control"
          />
          <label htmlFor="floatingInputLastName">LAST NAME</label>
        </div> */}
        <div className="form-floating">
          <input
            type="password"
            placeholder="Ex: 9A9A9A"
            onChange={handleInputChange(setSignUpCode)}
            value={signUpCode}
            id="floatingPassword"
            readOnly={signUpCode !== ""}
            className="signup-input form-control"
          />
          <label htmlFor="floatingPassword">ROOM CODE</label>
        </div>
        <button type="submit" className="signup-submit-btn">
          S I N G !
        </button>
        {/* <Link to="/login">
          <p>Already have an account?</p>
        </Link> */}
        <p className="error-message">{errorMessage}</p>
        <p className="desarrollado-por">App desarrollada por:</p>
        <p className="desarrollado-por-2">alvarezyanky7@gmail.com & alextor2625@gmail.com</p>
      </form>
      <img src={signUpFooter} alt="signup-footer" className="signup-footer" />
    </div>
  );
};

export default SignUpForm;
