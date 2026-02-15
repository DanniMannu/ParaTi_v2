import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image"; // melhor gestão de cache/perform.
import { Drawer } from "expo-router/drawer";
import { StyleSheet, View } from "react-native";

export default function RestauranteLayout() {
  return (
    <View style={styles.root}>
      {/* BACKGROUND (abaixo de tudo) */}
      <Image
        source={require("../../assets/images/background.png")}
        style={StyleSheet.absoluteFill}
        contentFit="cover" // cobre todo o ecrã mantendo proporção
        transition={200} // fade suave ao carregar
        // placeholder={blurhash}      // opcional: blurhash para loading
      />

      {/* CONTEÚDO (Drawer + screens) */}
      <Drawer
        screenOptions={{
          // Para o fundo “aparecer”, o conteúdo deve ser transparente:
          sceneStyle: { backgroundColor: "transparent" } as any, // (algumas versões pedem 'sceneStyle'; se der aviso, ver nota abaixo)
          // Em headers sólidos, a imagem não aparece atrás do header.
          // Se quiseres ver imagem atrás do header, podes usar:
          // headerTransparent: true,
          // headerTitleStyle: { color: "#fff" }, // adaptar contraste
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Início",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="OrdersScreen" // o teu ficheiro chama-se OrdersScreen.tsx
          options={{
            title: "Pedidos",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="MenuScreen" // MenuScreen.tsx
          options={{
            title: "Menu",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Definições",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="cog-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
});
