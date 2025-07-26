import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data._id) setUser(data);
          else setUser(null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session fetch failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

