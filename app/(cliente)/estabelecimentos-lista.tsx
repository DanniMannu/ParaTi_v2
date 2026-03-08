// app/(client)/estabelecimentos-lista.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  MOCK_ESTABLISHMENTS,
  MOCK_USER_LOCATION,
} from "../../src/data/establishments";
import type { Coords, Establishment } from "../../src/types/establishment";
import { formatCount, haversineKm } from "../../src/utils/geo";

export default function EstabelecimentosLista() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; extra?: string }>();

  const mode = (params.mode ?? "all") as
    | "nearby"
    | "sponsored"
    | "all"
    | "category"
    | "search";
  const extra = useMemo(() => {
    try {
      return params.extra ? JSON.parse(String(params.extra)) : {};
    } catch {
      return {};
    }
  }, [params.extra]);

  const data: Establishment[] = MOCK_ESTABLISHMENTS;
  const userCoords: Coords = MOCK_USER_LOCATION;

  const result = useMemo(() => {
    if (!Array.isArray(data)) return [];

    if (mode === "nearby") {
      const radiusKm = extra?.radiusKm ?? 15;
      return data
        .map((e) => ({ e, d: haversineKm(userCoords, e.coords) }))
        .filter((x) => x.d <= radiusKm)
        .sort((a, b) => a.d - b.d)
        .map((x) => x.e);
    }

    if (mode === "sponsored") return data.filter((e) => e.sponsored);

    if (mode === "category") {
      const cat = String(extra?.category ?? "").toLowerCase();
      return data.filter((e) =>
        e.categories.some((c) => c.toLowerCase() === cat),
      );
    }

    if (mode === "search") {
      const q = String(extra?.q ?? "")
        .trim()
        .toLowerCase();
      if (!q) return [];
      return data.filter((e) => {
        const inName = e.name.toLowerCase().includes(q);
        const inProd = e.products.some((p) => p.toLowerCase().includes(q));
        return inName || inProd;
      });
    }

    return data; // 'all'
  }, [data, mode, extra, userCoords]);

  const title = useMemo(() => {
    if (mode === "nearby") return "Perto de ti";
    if (mode === "sponsored") return "Em destaque";
    if (mode === "category") return `Categoria: ${extra?.category ?? ""}`;
    if (mode === "search") return "Resultados";
    return "Estabelecimentos";
  }, [mode, extra]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.back}>◂</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={result}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "./estabelecimento/establishmentOverview",
                params: { id: item.id },
              })
            }
            style={styles.row}
          >
            <Image source={{ uri: item.image }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.name}>
                {item.name}
              </Text>
              <Text style={styles.meta}>
                <Text style={styles.star}>★</Text> {item.rating.toFixed(1)}
                <Text style={styles.muted}>
                  {" "}
                  ({formatCount(item.ratingsCount)})
                </Text>{" "}
                · <Text style={styles.muted}>Taxa: </Text>
                {item.fee === 0
                  ? "Grátis"
                  : `${item.fee.toFixed(2)} MTN`} · {item.etaMin} min
              </Text>
              <Text numberOfLines={1} style={styles.muted}>
                {item.categories.join(" • ")}
              </Text>
            </View>
            {item.sponsored && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>Patrocinado</Text>
              </View>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#6B7280" }}>Sem resultados.</Text>
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
  },
  back: { fontSize: 20, color: "#111", width: 24, textAlign: "center" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  list: { paddingVertical: 8 },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  thumb: { width: 72, height: 72, borderRadius: 10, backgroundColor: "#eee" },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  meta: { color: "#111", marginTop: 2 },
  star: { color: "#F59E0B" },
  muted: { color: "#6B7280" },
  pill: {
    backgroundColor: "#111",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
