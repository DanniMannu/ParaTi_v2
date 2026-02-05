/*servirá para gerir os 3 perfis - Por alterar*/
import { createContext, ReactNode, useContext, useState } from "react";

export type Role = "cliente" | "restaurante" | "entregador";

type Ctx = { role: Role; setRole: (r: Role) => void };

const RoleContext = createContext<Ctx>({ role: "cliente", setRole: () => {} });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("restaurante"); // valor inicial temporário
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
