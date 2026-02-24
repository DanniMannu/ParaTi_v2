// src/components/OrderRequestCard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, Vibration, View } from "react-native";

export type PaymentType = "cash" | "app";

export type IncomingOrder = {
  id: string;
  restaurante: { nome: string; zona: string };
  distanciaKm: number;
  valorEntrega: number;
  tempoEstimadoMin: number;
  pagamento: PaymentType; // "cash" | "app"
};

type Props = {
  order: IncomingOrder;
  initialSeconds?: number; // default 40s
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onExpire?: (orderId: string) => void; // opcional
};

export default function OrderRequestCard({
  order,
  onAccept,
  onReject,
  onExpire,
  initialSeconds = 40,
}: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(true);

  // ✅ Corrigido: tipo compatível com RN
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reinicia o contador quando o pedido muda
  useEffect(() => {
    setSeconds(initialSeconds);
    setRunning(true);
  }, [order.id, initialSeconds]);

  // Inicia/limpa o setInterval enquanto "running" for true
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  // Lógica de expiração / avisos
  useEffect(() => {
    const orderId = order.id; // captura estável local

    if (seconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setRunning(false);
      try {
        Vibration.vibrate?.(200);
      } catch {}
      onExpire?.(orderId);
      onReject(orderId); // comportamento padrão ao expirar
      return;
    }

    if (seconds === 10) {
      try {
        Vibration.vibrate?.(80);
      } catch {}
    }
  }, [seconds, order.id, onExpire, onReject]);

  const pagamentoLabel = useMemo(
    () => (order.pagamento === "cash" ? "Dinheiro" : "App"),
    [order.pagamento],
  );

  const tempoRestante = `${Math.max(0, seconds)}s`;

  const handleReject = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    onReject(order.id);
  };

  const handleAccept = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    try {
      Vibration.vibrate?.(50);
    } catch {}
    onAccept(order.id);
  };

  return (
    <View style={styles.card}>
      {/* Cabeçalho: restaurante e zona */}
      <View style={styles.header}>
        <Text style={styles.title}>{order.restaurante.nome}</Text>
        <Text style={styles.zone}>{order.restaurante.zona}</Text>
      </View>

      {/* Linhas informativas */}
      <View style={styles.row}>
        <Text style={styles.label}>Distância:</Text>
        <Text style={styles.value}>{order.distanciaKm.toFixed(1)} km</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Valor da entrega:</Text>
        <Text style={[styles.value, styles.valueEmphasis]}>
          {order.valorEntrega.toFixed(2)} MTN
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tempo estimado:</Text>
        <Text style={styles.value}>{order.tempoEstimadoMin} min</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pagamento:</Text>
        <Text style={styles.value}>{pagamentoLabel}</Text>
      </View>

      {/* Barra inferior: timer + ações */}
      <View style={styles.footer}>
        {/* Badge do tempo restante */}
        <View style={[styles.timerBadge, seconds <= 10 && styles.timerLow]}>
          <Text
            style={[styles.timerText, seconds <= 10 && styles.timerTextLow]}
          >
            ⏱ {tempoRestante}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={handleReject}
            style={({ pressed }) => [
              styles.btn,
              styles.btnReject,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.btnRejectText}>Recusar</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleAccept}
            style={({ pressed }) => [
              styles.btn,
              styles.btnAccept,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.btnAcceptText}>Aceitar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "800", color: "#111827" },
  zone: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: { color: "#374151", fontWeight: "600" },
  value: { color: "#111827", fontWeight: "700" },
  valueEmphasis: { color: "#0F766E" },

  footer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  timerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  timerLow: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
  },
  timerText: { color: "#065F46", fontWeight: "700" },
  timerTextLow: { color: "#92400E" },

  actions: { flexDirection: "row", gap: 10 },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnPressed: { opacity: 0.9 },
  btnReject: { backgroundColor: "#F3F4F6" },
  btnRejectText: { color: "#1F2937", fontWeight: "800" },
  btnAccept: { backgroundColor: "#2563EB" },
  btnAcceptText: { color: "#FFFFFF", fontWeight: "800" },
});
