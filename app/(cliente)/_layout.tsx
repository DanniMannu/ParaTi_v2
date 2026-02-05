// app/(cliente)/_layout.tsx
import { Drawer } from "expo-router/drawer";
export default function ClienteLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "Home (Cliente)" }} />
    </Drawer>
  );
}
