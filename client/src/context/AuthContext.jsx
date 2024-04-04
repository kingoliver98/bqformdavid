import { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return JSON.parse(localStorage.getItem("token")) || null;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("userinfo"));
    if (getUser) {
      setUser(getUser);
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem("userinfo", JSON.stringify(user));
    }
  }, [user]);

  const handleGetUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  }, [token, setUser]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    window.location.reload();
  };

  const contextData = {
    user,
    setUser,
    token,
    setToken,
    isSubmitting,
    setIsSubmitting,
    logout,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
