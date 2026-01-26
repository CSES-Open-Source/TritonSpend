import { createContext, useCallback, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_PORT } from "@env";

export interface AuthUserSession {
  user: any | null;
  userId: any | null;
}

const authUserSessionKeys = ["user", "userId"];

type UseStateHook = [
  [boolean, AuthUserSession],
  (value: AuthUserSession | null) => void,
];

function useAsyncState(
  initialValue: [boolean, AuthUserSession | null] = [true, null],
): UseStateHook {
  return useReducer(
    (
      state: [boolean, AuthUserSession | null],
      action: AuthUserSession | null = null,
    ): [boolean, AuthUserSession | null] => {
      console.log("useStorageState.tsx: set isLoading to false");
      console.table(action);
      return [false, action];
    },
    initialValue,
  ) as UseStateHook;
}

async function getStorageItem(): Promise<AuthUserSession> {
  let session: AuthUserSession = {
    user: null,
    userId: null,
  };
  const storedUser = await AsyncStorage.getItem("user");
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);

      // Validate session with backend
      const res = await fetch(`http://localhost:${BACKEND_PORT}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Session invalid");
      return { user: userData, userId: userData.id };
    } catch (err) {
      await AsyncStorage.clear();
      return { user: null, userId: null };
    }
  }
  return session;
}

async function setStorageItem(value: AuthUserSession | null) {
  if (value == null) {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userId");
  } else {
    await AsyncStorage.setItem("user", JSON.stringify(value.user));
    await AsyncStorage.setItem("userId", value.userId);
  }
}

export default function useStorageState(): UseStateHook {
  // Public
  const [state, setState] = useAsyncState([true, { user: null, userId: null }]);

  // Get
  useEffect(() => {
    console.log("userStorageState.tsx: the getter is ran");
    getStorageItem().then((value) => {
      console.table(value);
      setState(value);
    });
  }, []);

  // Set
  const setValue = useCallback((value: AuthUserSession | null) => {
    console.log("userStorageState.tsx: the setter is ran");
    console.table(value);
    setState(value);
    setStorageItem(value);
  }, []);

  return [state, setValue];
}
