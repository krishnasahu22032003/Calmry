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

/* ================= AXIOS CONFIG ================= */

// Always send cookies
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

  /* ================= CHECK SESSION ================= */

  const checkSession = async () => {
    try {
      setLoading(true);

      // Cookie automatically sent
      const response = await axios.get(
        ENV.BACKEND_ME_URL as string,
        { withCredentials: true }
      );

      const userData = response.data?.user;

      if (userData) {
        const { password, ...safeUser } =
          userData;
        setUser(safeUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      // 401 automatically lands here
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL CHECK ================= */

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

/* ================= HOOK ================= */

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      "useSession must be used within a SessionProvider"
    );
  }

  return context;
}
