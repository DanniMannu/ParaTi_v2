import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function Notifications() {
  const [newOrders, setNewOrders] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(true);

  return (
    <View style={styles.container}>
      <Item
        label="🔔 Novos pedidos"
        value={newOrders}
        onChange={setNewOrders}
      />
      <Item label="🔕 Sons de pedido" value={sounds} onChange={setSounds} />
      <Item label="📳 Vibração" value={vibration} onChange={setVibration} />
    </View>
  );
}

function Item({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} thumbColor="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F7FAFF", flex: 1 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
  row: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { fontSize: 16, fontWeight: "600" },
});
