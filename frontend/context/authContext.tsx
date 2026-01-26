import { createContext, useContext, ReactNode } from "react";
import { useRouter } from "expo-router";
import useStorageState, { AuthUserSession } from "@/hooks/useStorageState";

interface AuthContextType extends AuthUserSession {
  isLoading: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [[isLoading, session], setSession] = useStorageState();
  const router = useRouter();

  const login = async (userData: any) => {
    setSession({ user: userData, userId: userData.id });
    router.replace("/");
  };

  const logout = async () => {
    setSession({ user: null, userId: null });
    router.replace("/Login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        userId: session.userId,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
