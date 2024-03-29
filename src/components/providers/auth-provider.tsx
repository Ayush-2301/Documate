"use client";
import { useState, createContext } from "react";
import { Session } from "@supabase/supabase-js";

interface AuthContextValue {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const defualtValue: AuthContextValue = {
  isLoading: true,
  setIsLoading: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  session: null,
  setSession: () => {},
};

export const AuthContext = createContext<AuthContextValue>(defualtValue);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
        session,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
