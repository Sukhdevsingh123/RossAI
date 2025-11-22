import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE || "https://rossai.onrender.com";

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          user_id: payload.user_id,
          company_id: payload.company_id,
          team_id: payload.team_id,
          project_id: payload.project_id,
          roles: payload.roles || [],
        });
      } catch (e) {
        console.error("Failed to decode token:", e);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (accessToken) => {
    setToken(accessToken);
    localStorage.setItem("access_token", accessToken);
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      setUser({
        user_id: payload.user_id,
        company_id: payload.company_id,
        team_id: payload.team_id,
        project_id: payload.project_id,
        roles: payload.roles || [],
      });
    } catch (e) {
      console.error("Failed to decode token:", e);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        getAuthHeaders,
        API_BASE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

