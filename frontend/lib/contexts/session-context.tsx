"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ENV } from "../env";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
}

const SessionContext = createContext<
  SessionContextType | undefined
>(undefined);

axios.defaults.withCredentials = true;

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        ENV.BACKEND_ME_URL as string,
        { withCredentials: true }
      );
      const userData = response.data

      if (userData) {
        const { password, ...safeUser } =
          userData;
        setUser(safeUser);
      } else {
        setUser(null);
      }
    } catch (error) {
   
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        checkSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      "useSession must be used within a SessionProvider"
    );
  }

  return context;
}
