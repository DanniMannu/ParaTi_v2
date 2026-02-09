import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert, // <-- novo
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrderCard from "../../src/components/OrderCard";
import { mockHistory, mockOrders } from "../../src/data/orders";
import { Order } from "../../src/types/Order";
import {
  acceptOrder,
  cancelOrder,
  getMinutesSince,
  markAsReady,
  rejectOrder,
  startPreparing,
} from "../../src/utils/orderActions";

export default function OrdersScreen() {
  const [tab, setTab] = useState<"active" | "history">("active");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState(mockOrders); // estado local para mock

  const ordersToShow = tab === "active" ? orders : mockHistory;

  function updateOrder(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  // ação simples para o botão de ajuda (placeholder)
  function onAskHelpPress(order: Order) {
    Alert.alert(
      "Pedido de ajuda",
      `Foi pedido suporte para o Pedido #${order.id}`,
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Os teus Pedidos{" "}
        <MaterialCommunityIcons name="format-list-checks" size={24} />
      </Text>
      <View style={styles.separator} />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TabButton
          label="Ativos"
          active={tab === "active"}
          onPress={() => setTab("active")}
        />
        <TabButton
          label="Histórico"
          active={tab === "history"}
          onPress={() => setTab("history")}
        />
      </View>

      {/* LISTA DE PEDIDOS */}
      <FlatList
        data={ordersToShow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => (
          // mantém o OrderCard simples, sem ajuda aqui
          <OrderCard order={item} onPress={() => setSelectedOrder(item)} />
        )}
      />

      {/* MODAL DE DETALHES */}
      <Modal visible={!!selectedOrder} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            {/* BOTÃO FECHAR */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedOrder(null)}
            >
              <Text style={{ fontSize: 22 }}>✕</Text>
            </TouchableOpacity>

            {selectedOrder && (
              <View>
                <Text style={styles.modalTitle}>
                  Pedido #{selectedOrder.id}
                </Text>
                <Text style={styles.modalTime}>
                  {getMinutesSince(selectedOrder.createdAt)} min atrás
                </Text>

                {/* LISTA DE ITEMS */}
                <View style={{ marginVertical: 12 }}>
                  {selectedOrder.items.map((it) => (
                    <Text key={it.id} style={styles.itemLine}>
                      {it.qty} × {it.name} — {it.price * it.qty} MTN
                    </Text>
                  ))}
                </View>

                {/* TOTAL */}
                <Text style={styles.modalTotal}>
                  Total: {selectedOrder.total.toFixed(2)} MTN
                </Text>

                {/* Estado */}
                <Text style={styles.modalStatus}>
                  Status: {selectedOrder.status}
                </Text>

                {/* AÇÕES DEPENDENDO DO ESTADO */}
                <View style={{ marginTop: 20 }}>
                  {/* pendente: Aceitar / Recusar */}
                  {selectedOrder.status === "pendente" && (
                    <View style={styles.rowButtons}>
                      <ActionButton
                        label="Aceitar"
                        color="rgba(9, 171, 74, 0.95)"
                        onPress={() => {
                          const updated = acceptOrder(selectedOrder);
                          updateOrder(updated);
                          setSelectedOrder(updated);
                        }}
                      />
                      <ActionButton
                        label="Recusar"
                        color="#d02e2e"
                        onPress={() => {
                          const updated = rejectOrder(selectedOrder);
                          updateOrder(updated);
                          setSelectedOrder(updated);
                        }}
                      />
                    </View>
                  )}

                  {/* aceite: A Preparar / Cancelar / Pedido de ajuda */}
                  {selectedOrder.status === "aceite" && (
                    <>
                      <ActionButton
                        label="A Preparar"
                        color="rgb(22, 231, 85)"
                        onPress={() => {
                          const updated = startPreparing(selectedOrder);
                          updateOrder(updated);
                          setSelectedOrder(updated);
                        }}
                      />
                      <ActionButton
                        label="Cancelar Pedido"
                        color="#EF4444"
                        onPress={() => {
                          const updated = cancelOrder(selectedOrder);
                          updateOrder(updated);
                          setSelectedOrder(updated);
                        }}
                      />
                      {/* <-- novo botão */}
                      <ActionButton
                        label="Pedido de ajuda"
                        color="#2563EB"
                        onPress={() => onAskHelpPress(selectedOrder)}
                      />
                    </>
                  )}

                  {/* em preparação: Marcar como pronto / Pedido de ajuda */}
                  {selectedOrder.status === "em preparação" && (
                    <>
                      <ActionButton
                        label="Marcar como pronto"
                        color="#22C55E"
                        onPress={() => {
                          const updated = markAsReady(selectedOrder);
                          updateOrder(updated);
                          setSelectedOrder(updated);
                        }}
                      />
                      {/* <-- novo botão */}
                      <ActionButton
                        label="Pedido de ajuda"
                        color="#2563EB"
                        onPress={() => onAskHelpPress(selectedOrder)}
                      />
                    </>
                  )}

                  {/* pronto: apenas tem Pedido de ajuda */}
                  {selectedOrder.status === "pronto" && (
                    <ActionButton
                      label="Pedido de ajuda"
                      color="#2563EB"
                      onPress={() => onAskHelpPress(selectedOrder)}
                    />
                  )}

                  {/* recusado / cancelado: sem ações */}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabBtn}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
      {active && <View style={styles.activeLine} />}
    </TouchableOpacity>
  );
}

function ActionButton({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionBtn, { backgroundColor: color }]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/** ---- ESTILOS ---- */
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "800" },
  separator: { height: 2, backgroundColor: "#E5E7EB", marginVertical: 8 },
  tabs: { flexDirection: "row", gap: 24 },
  tabBtn: { alignItems: "center" },
  tabText: { fontSize: 16, color: "#666" },
  tabTextActive: { color: "#000", fontWeight: "700" },
  activeLine: {
    height: 3,
    marginTop: 4,
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 2,
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
  },
  closeBtn: { position: "absolute", right: 10, top: 10 },
  modalTitle: { fontSize: 22, fontWeight: "700" },
  modalTime: { color: "#666" },
  itemLine: { fontSize: 15, marginTop: 6 },
  modalTotal: { marginTop: 12, fontSize: 18, fontWeight: "700" },
  modalStatus: { marginTop: 6, fontStyle: "italic", color: "#444" },

  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionText: { color: "#FFF", textAlign: "center", fontWeight: "700" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
