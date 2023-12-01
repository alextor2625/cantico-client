import { API_URL } from "./config.service";
import axios from "axios";
import { useSongs } from "../context/Songs.context";

export const storeToken = (token) => {
  localStorage.setItem("authToken", token);
  console.log("Line 6 - Token:", token);
};

export const authenticateUser = () => {
  const storedToken = localStorage.getItem("authToken");

  if (storedToken) {
    return axios
      .get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        return { user: response.data.user, isLoggedIn: true, isLoading: false };
      })
      .catch((error) => {
        console.log("Line 27 - Error:", error);
        return { user: null, isLoggedIn: false, isLoading: false };
      });
  } else {
    return Promise.resolve({ user: null, isLoggedIn: false, isLoading: false });
  }
};

export const signup = async (
  name,
  lastname,
  email,
  telephone,
  password,
  admin
) => {
  const requestBody = { name, lastname, email, telephone, password, admin };

  try {
    const response = await axios.post(`${API_URL}/auth/signup`, requestBody);
    console.log("Line 33 - Created User:", response.data);
    if (response.data.success) {
      storeToken(response.data.authToken);
    }
    return response.data;
  } catch (error) {
    console.log("Line 36 - Error:", error);
    throw new Error(error.response.data.msg);
  }
};

export const handleInputChange = (setFunction) => (event) => {
  setFunction(event.target.value);
};

export const login = async (
  email,
  password,
  setIsLoggedIn,
  setUser,
  callback
) => {
  const requestBody = { email, password };

  try {
    const response = await axios.post(`${API_URL}/auth/login`, requestBody);
    // console.log("Line 57 - Login User:", response.data);
    if (response.data.success) {
      storeToken(response.data.authToken);
      setIsLoggedIn(true);
      setUser(response.data.user);

      console.log("Line 66 - setUser:", response.data.user);

      if (callback) callback(response.data.user);
    }
    return response.data;
  } catch (error) {
    console.log("Line 60 - Error:", error);
    throw new Error(error.response.data.msg);
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");

  setIsLoggedIn(false);

  setActiveTab("home");
};

export const generateCode = async () => {
  const { setCode } = useSongs();

  try {
    const response = await axios.get(`${API_URL}/auth/generate-code`);

    console.log(response);
    return response.data.genCode;
  } catch (error) {
    console.log("Line error:", error);
  }
};

export const tempSignUp = async (
  name,
  signUpCode,
  setIsLoggedIn,
  setUser,
  callback
) => {
  const requestBody = { name, signUpCode };

  try {
    const response = await axios.post(
      `${API_URL}/auth/signup/temp-user`,
      requestBody
    );

    if (response.data.success) {
      storeToken(response.data.authToken);
      setIsLoggedIn(true);
      setUser(response.data.user);
      setCode(response.data);
    }

    if (callback) {
      callback(response.data.user);
    }

    console.log("Tempt User:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error:", error);
  }
};
