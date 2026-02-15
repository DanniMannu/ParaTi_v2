// app/(restaurante)/settings/index.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsHome() {
  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      //style={styles.bg}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      {/* Overlay opcional para melhorar contraste (podes remover se não precisares) */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <MenuItem
          icon="account-circle-outline"
          title="Perfil"
          onPress={() => router.push("/(restaurante)/settings/profile")}
        />
        <MenuItem
          icon="clock-outline"
          title="Horário"
          onPress={() => router.push("/(restaurante)/settings/schedule")}
        />
        <MenuItem
          icon="file-document-outline"
          title="Documentação"
          onPress={() => router.push("/(restaurante)/settings/documents")}
        />
        <MenuItem
          icon="help-circle-outline"
          title="Questões frequentes"
          onPress={() => router.push("/(restaurante)/settings/faq")}
        />
      </View>
    </ImageBackground>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        <MaterialCommunityIcons name={icon} size={20} color="#0F3EA8" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#111827" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /** Fundo */
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)", // opcional: 8% para legibilidade
  },

  /** Conteúdo */
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent", // não tapar o fundo
  },

  /** UI dos itens */
  item: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.86)", // cartão translúcido sobre o fundo
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // Sombra leve
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontWeight: "800", color: "#0F172A", fontSize: 15 },
});
