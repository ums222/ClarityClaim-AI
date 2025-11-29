import React, { createContext, useContext, useState, useEffect } from "react";

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
};

const AuthContext = createContext<AuthContextValue>({ user: null, token: null });

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with real login flow
    const mockUser: User = {
      id: "user-dev-1",
      name: "Dev Billing Specialist",
      email: "dev@clarityclaim.ai",
      tenantId: "tenant-dev-1",
      role: "BILLING_SPECIALIST",
    };
    setUser(mockUser);
    setToken("dev-mock-jwt");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
