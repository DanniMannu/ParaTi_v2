// app/_layout.tsx
import { Slot } from "expo-router";
import { RoleProvider } from "../src/context/RoleContext"; // <- fora de app

export default function RootLayout() {
  return (
    <RoleProvider>
      <Slot />
    </RoleProvider>
  );
}
