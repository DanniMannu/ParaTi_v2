// app/(client)/estabelecimento/[id]/menu.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_ESTABLISHMENTS } from "../../../../src/data/establishments";
import {
    categoriesForEstablishment,
    productsByEstablishment,
} from "../../../../src/data/menu";
import { formatPriceEUR } from "../../../../src/utils/geo";

export default function EstablishmentMenu() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const est = useMemo(() => MOCK_ESTABLISHMENTS.find((e) => e.id === id), [id]);
  const allProducts = useMemo(
    () => (id ? productsByEstablishment(String(id)) : []),
    [id],
  );
  const categories = useMemo(
    () => (id ? categoriesForEstablishment(String(id)) : []),
    [id],
  );

  const [activeCat, setActiveCat] = useState<string>(categories[0] ?? "");

  if (!est) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.back}>◂</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Menu</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ padding: 16 }}>
          <Text>Estabelecimento não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const list = allProducts.filter(
    (p) => !activeCat || p.category === activeCat,
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.back}>◂</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {est.name}
        </Text>
        <Pressable hitSlop={8}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
        </Pressable>
      </View>

      {/* Tabs de categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {categories.map((c) => {
          const active = c === activeCat;
          return (
            <Pressable
              key={c}
              onPress={() => setActiveCat(c)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {c}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 12 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "./produto/establishment",
                params: { id: item.id },
              })
            }
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.name}>{item.name}</Text>
              {!!item.description && (
                <Text numberOfLines={2} style={styles.desc}>
                  {item.description}
                </Text>
              )}
              <Text style={styles.price}>{formatPriceEUR(item.price)}</Text>
            </View>
            <View style={{ position: "relative" }}>
              <Image source={{ uri: item.image }} style={styles.thumb} />
              <View style={styles.plusCircle}>
                <Text style={{ color: "#111", fontSize: 18 }}>＋</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#111" }}>
              {activeCat || "Menu"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 12,
    gap: 8,
  },
  back: { fontSize: 20, color: "#111", width: 24, textAlign: "center" },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  tabs: { paddingHorizontal: 8, paddingVertical: 8, gap: 8 },
  tab: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  tabActive: { backgroundColor: "#111" },
  tabText: { color: "#111", fontWeight: "700" },
  tabTextActive: { color: "#fff" },

  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginLeft: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  desc: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  price: { fontSize: 14, color: "#111", marginTop: 6, fontWeight: "700" },
  thumb: { width: 92, height: 92, borderRadius: 12, backgroundColor: "#eee" },
  plusCircle: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
  },
});
