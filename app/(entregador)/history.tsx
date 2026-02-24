import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type FinalStatus =
  | "aceite"
  | "recusado"
  | "expirado"
  | "cliente_ausente"
  | "restaurante_sem_pedido";

type HistoryEntry = {
  id: string;
  createdAt: number;
  restauranteNome: string;
  restauranteZona: string;
  clienteNome: string;
  clienteZona: string;
  distanciaKm: number;
  tempoEstimadoMin: number;
  ganhoMtn: number; // ← ganho por pedido (guardado quando encerra)
  pagamento: "cash" | "app";
  status: FinalStatus;
  closedAt: number;
};

const STORAGE_HISTORY_KEY = "courier.history.v1";

export default function Historico() {
  const [data, setData] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_HISTORY_KEY);
        setData(raw ? JSON.parse(raw) : []);
      } catch {
        setData([]);
      }
    };
    load();
  }, []);

  // Total ganho (soma de todos os ganhos, independentemente do estado)
  const totalGanho = useMemo(
    () => data.reduce((acc, item) => acc + (Number(item.ganhoMtn) || 0), 0),
    [data],
  );

  // (Opcional) Formatar moeda
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-PT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  const statusLabel = (s: FinalStatus) =>
    s === "aceite"
      ? "Aceite"
      : s === "recusado"
        ? "Recusado"
        : s === "expirado"
          ? "Expirado"
          : s === "cliente_ausente"
            ? "Cliente ausente"
            : "Restaurante sem pedido";

  return (
    <View style={styles.screen}>
      {/* Cabeçalho com Total Ganho */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total ganho</Text>
        <Text style={styles.summaryValue}>{fmt(totalGanho)} MT</Text>
      </View>

      {data.length === 0 ? (
        <Text style={styles.empty}>Sem registos.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id + "_" + item.closedAt}
          contentContainerStyle={{ paddingBottom: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nameLine}>
                {item.restauranteNome} • {item.restauranteZona}
              </Text>
              <Text style={styles.subtle}>
                Cliente: {item.clienteNome} • {item.clienteZona}
              </Text>
              <Text style={styles.subtle}>
                {item.distanciaKm.toFixed(1)} km • ~{item.tempoEstimadoMin} min
                • {item.pagamento === "cash" ? "Cash" : "App"}
              </Text>

              {/* Linha de ganho visível em cada registo */}
              <View style={styles.row}>
                <Text style={styles.ganhoLabel}>Ganho</Text>
                <Text style={styles.ganhoValue}>+ {fmt(item.ganhoMtn)} MT</Text>
              </View>

              <View style={[styles.row, { marginTop: 6 }]}>
                <Text style={{ color: "#6B7280" }}>
                  {new Date(item.createdAt).toLocaleString("pt-PT")}
                </Text>
                <Text style={[styles.badge, badgeStyleFor(item.status)]}>
                  {statusLabel(item.status)}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function badgeStyleFor(status: FinalStatus) {
  switch (status) {
    case "aceite":
      return { backgroundColor: "#DCFCE7", color: "#166534" };
    case "recusado":
      return { backgroundColor: "#FFE4E6", color: "#9F1239" };
    case "expirado":
      return { backgroundColor: "#FEF9C3", color: "#92400E" };
    case "cliente_ausente":
      return { backgroundColor: "#E0E7FF", color: "#3730A3" };
    case "restaurante_sem_pedido":
      return { backgroundColor: "#F1F5F9", color: "#0F172A" };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7FAFF", padding: 20, paddingTop: 28 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { color: "#6B7280", fontWeight: "700" },
  summaryValue: { color: "#0F766E", fontWeight: "900", fontSize: 18 },

  empty: { color: "#6B7280" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 10,
  },
  nameLine: { color: "#111827", fontWeight: "800" },
  subtle: { color: "#6B7280", marginTop: 2 },

  row: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ganhoLabel: { color: "#374151", fontWeight: "700" },
  ganhoValue: { color: "#065F46", fontWeight: "900" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "800",
    overflow: "hidden",
  },
});
