import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedCredentials = localStorage.getItem("credentials");
    if (storedCredentials) {
      try {
        const parsed = JSON.parse(storedCredentials);
        if (parsed?.access_token && parsed?.role) {
          setUser(parsed);
        }
      } catch (error) {
        console.error("Invalid credentials in storage");
        localStorage.removeItem("credentials");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("credentials");
    setUser(null);
    navigate("/");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        theme,
        setTheme,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
