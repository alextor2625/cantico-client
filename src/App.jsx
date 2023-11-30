import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SessionsPage from "./pages/SessionsPage";
import StreamingPage from "./pages/StreamingPage";
import Cantar from "./pages/Cantar";
import MySongsCell from "./pages/MySongsCell";
import Queue from "./pages/Queue";
import axios from "axios";
import "./App.css";
import { API_URL } from "./services/config.service";

function App() {
  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const removeToken = () => {
    return localStorage.removeItem("authToken");
  };
  const isTokenValid = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.data.success) {
        removeToken();
      }
      return response.data.success;
    } catch (error) {
      removeToken();
      console.log(error);
    }
  };

  const LoggedIn = () => {
    return getToken() && isTokenValid() ? (
      <Outlet />
    ) : (
      <Navigate to="/signup" />
    );
  };

  const NotLoggedIn = () => {
    return !getToken() ? <Outlet /> : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route element={<NotLoggedIn />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/:code" element={<SignUpPage />} />
      </Route>

      <Route element={<LoggedIn />}>
        <Route path="/streaming" element={<StreamingPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/mysongs" element={<MySongsCell />} />
        <Route path="/cantar" element={<Cantar />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
