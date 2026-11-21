import toast from "react-hot-toast";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email }
  const [token, setToken] = useState(null);
  const [streamtoken, setStreamtoken] = useState(null);
  const [loading, setLoading] = useState(true); // to avoid flicker on reload

  // Load auth state from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    const storedstreamtoken = localStorage.getItem("streamtoken");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setStreamtoken(storedstreamtoken)
    }

    setLoading(false);
  }, []);

  const login = (userData, authToken, givenstreamtoken) => {
    setUser(userData);
    setToken(authToken);
    setStreamtoken(givenstreamtoken)
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem('streamtoken',givenstreamtoken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("streamtoken");
    toast.success("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, streamtoken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
