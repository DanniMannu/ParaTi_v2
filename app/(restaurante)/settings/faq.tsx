// app/(restaurante)/faq.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ = [
  {
    q: "Como aceito ou recuso um pedido?",
    a: "Vai a Pedidos > Ativos, toca no pedido e utiliza os botões Aceitar/Recusar no modal.",
  },
  {
    q: "Como altero o horário do restaurante?",
    a: "Menu Drawer > Horário > Editar. Ajusta abertura/fecho, dias de descanso e férias e guarda.",
  },
  {
    q: "Onde consulto o contrato?",
    a: "Menu Drawer > Documentação. Toca em 'Ver' para abrir o documento.",
  },
  {
    q: "Como pedir suporte?",
    a: "No ecrã Pedidos tens um botão flutuante de Suporte (ícone). Toca para abrir a página de FAQ.",
  },
];

export default function FAQScreen() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    LayoutAnimation.easeInEaseOut();
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      {FAQ.map((item, i) => (
        <View key={i} style={styles.card}>
          <TouchableOpacity
            onPress={() => toggle(i)}
            style={styles.qRow}
            activeOpacity={0.7}
          >
            <Text style={styles.qText}>{item.q}</Text>
            <MaterialCommunityIcons
              name={openIdx === i ? "chevron-up" : "chevron-down"}
              size={20}
              color="#111827"
            />
          </TouchableOpacity>
          {openIdx === i && <Text style={styles.aText}>{item.a}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  qRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qText: { fontWeight: "700", color: "#0F172A", fontSize: 15 },
  aText: { marginTop: 8, color: "#374151" },
});
