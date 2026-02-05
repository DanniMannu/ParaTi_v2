// app/(restaurante)/_layout.tsx
//import { Ionicons } from "@expo/vector-icons";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function RestauranteLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="OrdersScreen"
        options={{
          title: "Pedidos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="MenuScreen"
        options={{
          title: "Menu",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SettingsScreen"
        options={{
          title: "Definições",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
