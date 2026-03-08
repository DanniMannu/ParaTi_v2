// app/(client)/estabelecimento/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
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

import { MOCK_ESTABLISHMENTS } from "../../../src/data/establishments";
import { featuredByEstablishment } from "../../../src/data/menu";
import { formatCount, formatPriceEUR } from "../../../src/utils/geo";

export default function EstablishmentOverview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const est = useMemo(() => MOCK_ESTABLISHMENTS.find((e) => e.id === id), [id]);
  const featured = useMemo(
    () => (id ? featuredByEstablishment(String(id)) : []),
    [id],
  );

  if (!est) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ padding: 16 }}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={{ fontSize: 18 }}>◂</Text>
          </Pressable>
          <Text style={{ marginTop: 16, fontSize: 16, color: "#111" }}>
            Estabelecimento não encontrado.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header simples */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.back}>◂</Text>
          </Pressable>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable hitSlop={8}>
              <Text style={styles.icon}>♡</Text>
            </Pressable>
            <Pressable hitSlop={8}>
              <Text style={styles.icon}>⋯</Text>
            </Pressable>
          </View>
        </View>

        {/* Banner */}
        <Image source={{ uri: est.image }} style={styles.hero} />

        {/* Nome + rating/linha meta */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text style={styles.title}>{est.name}</Text>
          <Text style={styles.meta}>
            <Text style={styles.star}>★</Text> {est.rating.toFixed(1)} (
            {formatCount(est.ratingsCount)}) ·{" "}
            <Text style={styles.muted}>Taxa de entrega:</Text>{" "}
            {est.fee === 0 ? "Grátis" : `${est.fee.toFixed(2)} MTN`} · ~{" "}
            {est.etaMin} min
          </Text>
        </View>

        {/* Chips Entrega | Recolha (mock) */}
        <View style={styles.modeRow}>
          <Pressable style={[styles.mode, styles.modeActive]}>
            <Text style={styles.modeTextActive}>Entrega</Text>
          </Pressable>
          <Pressable style={styles.mode}>
            <Text style={styles.modeText}>Recolha</Text>
          </Pressable>
        </View>

        {/* Cards rápidos */}
        <View style={styles.quickRow}>
          <View style={styles.quickCard}>
            <Text style={styles.quickTitle}>Taxa de entrega:</Text>
            <Text style={styles.quickValue}>
              {est.fee === 0 ? "Grátis" : `${est.fee.toFixed(2)} MTN`}
            </Text>
          </View>
          <View style={styles.quickCard}>
            <Text style={styles.quickTitle}>Entrega em</Text>
            <Text style={styles.quickValue}>{est.etaMin} min</Text>
            <Text style={styles.quickHint}>Chegada mais cedo</Text>
          </View>
        </View>

        {/* CTA Ver menu */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "./[establishment]/menu",
                params: { id: est.id },
              })
            }
            style={styles.menuBtn}
          >
            <Text style={styles.menuBtnText}>Ver menu</Text>
          </Pressable>
        </View>

        {/* Artigos em destaque */}
        <View style={{ marginTop: 16 }}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Artigos em destaque</Text>
          </View>
          <FlatList
            data={featured}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.itemTile}
                onPress={() =>
                  router.push({
                    pathname: "./produto/establishment",
                    params: { id: item.id },
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={{ padding: 8 }}>
                  <Text numberOfLines={1} style={styles.itemName}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatPriceEUR(item.price)}
                  </Text>
                </View>
                <View style={styles.addCircle}>
                  <Text style={{ color: "#111", fontSize: 18 }}>＋</Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { fontSize: 20, color: "#111" },
  icon: { fontSize: 18, color: "#111" },
  hero: { width: "100%", height: 180, backgroundColor: "#eee" },
  title: { fontSize: 22, fontWeight: "800", color: "#111" },
  star: { color: "#F59E0B" },
  muted: { color: "#6B7280" },
  meta: { marginTop: 6, color: "#111" },

  modeRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  mode: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  modeActive: { backgroundColor: "#111" },
  modeText: { color: "#111", fontWeight: "700" },
  modeTextActive: { color: "#fff", fontWeight: "700" },

  quickRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  quickCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  quickTitle: { fontSize: 12, color: "#6B7280" },
  quickValue: { fontSize: 16, fontWeight: "700", color: "#111", marginTop: 4 },
  quickHint: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  sectionHead: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111" },

  itemTile: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
    position: "relative",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  itemImage: { width: "100%", height: 120, backgroundColor: "#eee" },
  itemName: { fontSize: 14, fontWeight: "700", color: "#111" },
  itemPrice: { marginTop: 2, color: "#111" },
  addCircle: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
  },
  menuBtn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
