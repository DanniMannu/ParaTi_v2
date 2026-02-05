// app/(entregador)/_layout.tsx
import { Drawer } from "expo-router/drawer";
export default function EntregadorLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "Home (Entregador)" }} />
    </Drawer>
  );
}
