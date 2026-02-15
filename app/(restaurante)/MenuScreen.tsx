// app/(restaurante)/menu.tsx
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabKey = "menus" | "categories" | "items" | "promotions";

export default function MenuScreen() {
  const [tab, setTab] = useState<TabKey>("menus");

  return (
    <View style={styles.container}>
      {/* TABS TOP */}
      <View style={styles.tabs}>
        <Tab
          label="Menu"
          active={tab === "menus"}
          onPress={() => setTab("menus")}
        />
        <Tab
          label="Categorias"
          active={tab === "categories"}
          onPress={() => setTab("categories")}
        />
        <Tab
          label="Produtos"
          active={tab === "items"}
          onPress={() => setTab("items")}
        />
        <Tab
          label="Promoções"
          active={tab === "promotions"}
          onPress={() => setTab("promotions")}
        />
      </View>

      {/* HEADER "Menu ▼" + Edit */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
          <Text style={styles.editIcon}>⚙</Text>
          <Text style={styles.editText}>Alterar</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.card}>
        {tab === "menus" && <MenusPanel />}
        {tab === "categories" && <CategoriesPanel />}
        {tab === "items" && <ItemsPanel />}
        {tab === "promotions" && <PromotionsPanel />}
      </View>
    </View>
  );
}

/* ---- Panels (placeholders prontos para ligar a dados) ---- */

function MenusPanel() {
  // Ex.: lista de Menus (Almoço, Jantar, Fins‑de‑semana…)
  const data = [
    { id: "m1", name: "Menu Almoço", hours: "Seg–Sext 10:00–17:00" },
  ];
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={panelStyles.rowBetween}>
          <View>
            <Text style={panelStyles.title}>{item.name}</Text>
            <Text style={panelStyles.subtle}>{item.hours}</Text>
          </View>
          <TouchableOpacity style={panelStyles.linkBtn}>
            <Text style={panelStyles.linkText}>Manage</Text>
          </TouchableOpacity>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={panelStyles.sep} />}
    />
  );
}

function CategoriesPanel() {
  /**DMC - Buscar dados a Base de dados */
  const data = [
    { id: "c1", name: "Pizzas", items: 12 },
    { id: "c2", name: "Bebidas", items: 8 },
  ];
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={panelStyles.rowBetween}>
          <Text style={panelStyles.title}>{item.name}</Text>
          <Text style={panelStyles.subtle}>{item.items} items</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={panelStyles.sep} />}
    />
  );
}

function ItemsPanel() {
  const data = [
    { id: "i1", name: "Pizza Margherita", price: 12.5 },
    { id: "i2", name: "Hambúrguer Clássico", price: 10 },
  ];
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={panelStyles.rowBetween}>
          <Text style={panelStyles.title}>{item.name}</Text>
          <Text style={panelStyles.price}>{item.price.toFixed(2)} MTN</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={panelStyles.sep} />}
    />
  );
}

function PromotionsPanel() {
  const data = [
    { id: "p1", name: "2x1 Bebidas", active: true },
    { id: "p2", name: "10% Off Almoço", active: false },
  ];
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={panelStyles.rowBetween}>
          <Text style={panelStyles.title}>{item.name}</Text>
          <Text
            style={[
              panelStyles.badge,
              {
                backgroundColor: item.active ? "#DCFCE7" : "#F3F4F6",
                color: item.active ? "#166534" : "#374151",
              },
            ]}
          >
            {item.active ? "Active" : "Inactive"}
          </Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={panelStyles.sep} />}
    />
  );
}

/* ---- Tab Button ---- */
function Tab({
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

/* ---- Styles ---- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "transparent",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabBtn: { alignItems: "center", paddingBottom: 10 },
  tabText: { fontSize: 15, color: "#475569" },
  tabTextActive: { color: "#0F172A", fontWeight: "700" },
  activeLine: {
    marginTop: 4,
    height: 3,
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
  },
  menuTitleBtn: { paddingVertical: 4, paddingHorizontal: 6, borderRadius: 6 },
  menuTitle: { fontSize: 26, fontWeight: "800", color: "#0F172A" },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editIcon: { marginRight: 6, fontSize: 14 },
  editText: { fontWeight: "700", color: "#111827" },

  card: {
    marginTop: 16,
    marginBottom: 400,
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    flex: 1,
  },
});

const panelStyles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#111827" },
  subtle: { color: "#6B7280" },
  price: { fontWeight: "700", color: "#111827" },
  linkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  linkText: { color: "#1D4ED8", fontWeight: "700" },
  sep: { height: 1, backgroundColor: "#F3F4F6" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "700",
  },
});
