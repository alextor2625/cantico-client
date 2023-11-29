import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth.context.jsx";
import { SongsProvider } from "./context/Songs.context.jsx";
import "./index.css";
import { ErrorsProvider } from "./context/Errors.context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorsProvider>
          <SongsProvider>
            <App />
          </SongsProvider>
        </ErrorsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
