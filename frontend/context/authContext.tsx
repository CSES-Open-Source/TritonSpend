import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { BACKEND_PORT } from "@env";

interface AuthContextType {
  user: any | null;
  userId: any | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userId, setUserId] = useState<any | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          // Validate session with backend
          const res = await fetch(
                    `http://localhost:${BACKEND_PORT}/auth/me`,
                    {
                      credentials: "include",
                    },
          );

          if (!res.ok) throw new Error("Session invalid");
          setUser(userData);
          setUserId(userData.id);
        } catch (err) {
          await AsyncStorage.clear();
          setUser(null);
          setUserId(null);
          router.replace("/Login");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (userData: any) => {
    await Promise.all([
      AsyncStorage.setItem("user", JSON.stringify(userData)),
      AsyncStorage.setItem("userId", userData.id),
    ]);
    setUser(userData);
    setUserId(userData.id);
    router.replace("/");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userId");
    setUser(null);
    setUserId(null);
    router.replace("/Login");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, userId, login, logout }}>
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
