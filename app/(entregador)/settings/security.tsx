import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Security() {
  return (
    <View style={styles.container}>
      <Item label="Ativar localização" onPress={() => {}} />
      <Item label="Alterar palavra‑passe" onPress={() => {}} />
      <Item
        label="Terminar sessão"
        onPress={() => Alert.alert("Sessão terminada")}
      />
      <Item
        label="Eliminar conta"
        onPress={() =>
          Alert.alert(
            "Eliminar conta",
            "Tens a certeza? Esta ação é permanente.",
            [{ text: "Cancelar" }, { text: "Eliminar", style: "destructive" }],
          )
        }
      />
    </View>
  );
}

function Item({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Text style={styles.itemText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFF", padding: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
  item: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  itemText: { fontSize: 16, fontWeight: "600" },
});
