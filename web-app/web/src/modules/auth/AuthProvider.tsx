import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../../lib/apiClient";

type User = {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  role: "BILLING_SPECIALIST" | "MANAGER" | "EXECUTIVE" | "ADMIN";
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, token: null, loading: true });

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dev token from API
    const fetchDevToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/dev-token`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          setUser(data.user);
        } else {
          console.error("Failed to get dev token:", res.status);
        }
      } catch (err) {
        console.error("Failed to fetch dev token:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
