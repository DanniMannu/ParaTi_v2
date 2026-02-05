// app/(entregador)/index.tsx
import { StyleSheet, Text, View } from "react-native";
import SummaryCard from "../../src/components/SummaryCard";
// Opcional: podes ler o nome do utilizador de um contexto ou prop
const USER_FIRST_NAME = "Daniela"; // substitui quando tiveres auth/perfil

export default function EntregadorHome() {
  const salesToday = 250.0;
  const ordersToday = 6;

  return (
    <View style={styles.container}>
      {/* Saudação */}
      <Text style={styles.greet}>Olá, {USER_FIRST_NAME}</Text>

      {/* Título */}
      <Text style={styles.title}>Resumo de Hoje</Text>

      {/* Espaço para o seletor de loja (REMOVIDO conforme pedido) */}
      {/* <Dropdown ... /> */}

      {/* Cards lado a lado */}
      <View style={styles.row}>
        <SummaryCard
          label="Sales"
          value={`$${salesToday.toFixed(2)}`}
          style={{ marginRight: 12 }}
        />
        <SummaryCard label="Orders" value={ordersToday} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    backgroundColor: "#F7FAFF", // subtil azul muito claro para fundo
  },
  greet: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
  },
});
