import { API_URL } from "./config.service";
import axios from "axios";

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
        return { user: response.data, isLoggedIn: true, isLoading: false };
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

export const login = async (email, password, setIsLoggedIn, setUser, callback) => {
  const requestBody = { email, password };

  try {
    const response = await axios.post(`${API_URL}/auth/login`, requestBody);
    // console.log("Line 57 - Login User:", response.data);
    if (response.data.success) {
      storeToken(response.data.authToken);
      setIsLoggedIn(true);
      setUser(response.data.foundUser);
      
      console.log("Line 66 - setUser:", response.data.foundUser);

      if (callback) callback(response.data.foundUser);
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
