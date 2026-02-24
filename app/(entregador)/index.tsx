// app/(entregador)/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, usePathname } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SummaryCard from "../../src/components/SummaryCard";

// Opcional: podes ler o nome do utilizador de um contexto ou prop
const USER_FIRST_NAME = "Daniela"; // substituir quando tiveres auth/perfil
const STORAGE_KEY = "courier.availability"; // guarda online/offline

export default function EntregadorHome() {
  // (Mantemos o state caso queiras mais tabs locais no futuro)
  const pathname = usePathname();

  // --- MOCK dos teus números de hoje (mantidos) ---
  const salesToday = 900.0;
  const ordersToday = 6;

  // --- Disponibilidade (Online / Offline) com persistência ---
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "online") setIsOnline(true);
        if (saved === "offline") setIsOnline(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleOnline = async () => {
    const next = !isOnline;
    setIsOnline(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next ? "online" : "offline");
    } catch {
      // ignora falha de persistência
    }
  };

  const statusLabel = useMemo(
    () =>
      isOnline
        ? "Estas Online — a receber pedidos"
        : "Estas Offline — não irás receber pedidos",
    [isOnline],
  );
  const statusDotStyle = useMemo(
    () => (isOnline ? styles.dotOnline : styles.dotOffline),
    [isOnline],
  );
  const statusChipStyle = useMemo(
    () => (isOnline ? styles.chipOnline : styles.chipOffline),
    [isOnline],
  );

  if (loading) {
    return <View style={[styles.container]} />;
  }

  return (
    <View style={styles.container}>
      {/* Saudação */}
      <Text style={styles.greet}>Olá, {USER_FIRST_NAME}</Text>

      {/* Título */}
      <Text style={styles.title}>Resumo de Hoje</Text>

      {/* Linha: Botão Online/Offline + Chip de estado */}
      <View style={styles.topRow}>
        <Pressable onPress={toggleOnline} style={[styles.availabilityBtn]}>
          <View
            style={[
              styles.switchKnob,
              isOnline ? styles.switchOn : styles.switchOff,
            ]}
          />
          <Text style={[styles.availabilityText]}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </Pressable>

        <View style={[styles.statusChip, statusChipStyle]}>
          <View style={[styles.dot, statusDotStyle]} />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      {/* Cards lado a lado (mantidos) */}
      <View style={styles.row}>
        <SummaryCard
          label="Hoje já ganhaste"
          value={`${salesToday.toFixed(2)} MTN`}
          style={{ marginRight: 12 }}
        />
        <SummaryCard label="Total de pedidos realizados" value={ordersToday} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { marginTop: 26 }]}>
        {/* Navega explicitamente para /(entregador)/orders */}
        <Link href="/(entregador)/orders" asChild>
          <TabButton
            label="os teus Pedidos Ativos"
            // Considera 'active' quando a rota corrente for a de orders
            active={pathname === "/(entregador)/orders"}
          />
        </Link>
      </View>
    </View>
  );
}

/** ---- COMPONENTES AUXILIARES ---- */

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress?: () => void; // opcional quando usamos Link asChild
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabBtn}
      activeOpacity={0.18}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
      {active && <View style={styles.activeLine} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    backgroundColor: "#F7FAFF", // fundo azul muito claro
  },
  greet: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  tabBtn: { alignItems: "center" },
  tabs: { flexDirection: "row", gap: 24 },
  tabText: { fontSize: 16, color: "#666" },
  tabTextActive: { color: "#000", fontWeight: "700" },
  activeLine: {
    height: 3,
    marginTop: 4,
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },

  // --- Top controls (toggle + chip) ---
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },

  // --- Botão Online/Offline (compacto, tipo switch largo) ---
  availabilityBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  availabilityText: {
    marginLeft: 8,
    fontWeight: "700",
    color: "#111827",
  },
  switchKnob: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  switchOn: { backgroundColor: "#22C55E" }, // verde
  switchOff: { backgroundColor: "#A78BFA" }, // lilás

  // --- Chip de estado com ponto e legenda ---
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipOnline: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  chipOffline: {
    backgroundColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  dotOnline: { backgroundColor: "#10B981" }, // verde
  dotOffline: { backgroundColor: "#C4B5FD" }, // lilás
  statusText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },

  // --- Cards lado a lado (mantidos) ---
  row: {
    flexDirection: "row",
  },
});