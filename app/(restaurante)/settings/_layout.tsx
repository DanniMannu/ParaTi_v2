// app/(restaurante)/settings/_layout.tsx
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // <-- oculta o topo em todas as páginas de Definições
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="Questões frequentes" />
    </Stack>
  );
}
