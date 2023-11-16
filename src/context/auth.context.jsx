import React, { createContext, useState, useEffect } from "react";
import { storeToken, authenticateUser } from "../services/auth.service";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authenticateUser().then((data) => {
      setIsLoggedIn(data.isLoggedIn);
      setIsLoading(data.isLoading);
      setUser(data.user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        setUser,
        user,
        storeToken,
        authenticateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };