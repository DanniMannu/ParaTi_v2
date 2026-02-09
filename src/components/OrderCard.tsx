import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Order } from "../types/Order";
import { getMinutesSince } from "../utils/orderActions";

export default function OrderCard({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.orderId}>Pedido #{order.id}</Text>
        <Text style={styles.time}>
          {getMinutesSince(order.createdAt)} min atrás
        </Text>
      </View>

      {/* ITEMS */}
      <View style={{ marginTop: 8 }}>
        {order.items.slice(0, 2).map((item) => (
          <Text key={item.id} style={styles.itemLine}>
            {item.qty} × {item.name}
          </Text>
        ))}

        {/* Se tiver mais items */}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.total}>{order.total.toFixed(2)} MTN</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    fontWeight: "700",
    fontSize: 16,
  },
  time: {
    color: "#6B7280",
  },
  itemLine: {
    color: "#333",
  },
  moreItems: {
    fontStyle: "italic",
    color: "#777",
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: {
    fontWeight: "700",
    fontSize: 16,
  },
  status: {
    color: "#374151",
    fontStyle: "italic",
  },
});
