// src/context/RoleContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "cliente" | "restaurante" | "entregador";
type RoleContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  loading: boolean;
};

const STORAGE_KEY = "app.role";

const RoleContext = createContext<RoleContextValue>({
  role: "cliente",
  setRole: () => {},
  loading: true,
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("cliente"); // default mudar o role.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          saved === "cliente" ||
          saved === "restaurante" ||
          saved === "entregador"
        ) {
          setRoleState(saved);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setRole = async (next: Role) => {
    setRoleState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignora erro de persistência silenciosamente
    }
  };

  const value = useMemo(() => ({ role, setRole, loading }), [role, loading]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);
