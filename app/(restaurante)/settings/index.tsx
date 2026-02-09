// app/(restaurante)/settings/index.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsHome() {
  return (
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
  container: { flex: 1, backgroundColor: "#FFF", padding: 16 },
  subtitle: { color: "#6B7280", marginBottom: 12 },
  item: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontWeight: "800", color: "#0F172A", fontSize: 15 },
});
