// app/(client)/produto/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QuantityStepper from "../../../src/components/QuantityStepper";
import { getProductById } from "../../../src/data/menu";
import { formatPriceEUR } from "../../../src/utils/geo";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = useMemo(() => getProductById(String(id)), [id]);

  const [qty, setQty] = useState<number>(0);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.back}>◂</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Produto</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ padding: 16 }}>
          <Text>Produto não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const total = product.price * qty;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.back}>◂</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {product.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image source={{ uri: product.image }} style={styles.hero} />
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{formatPriceEUR(product.price)}</Text>
          {!!product.description && (
            <Text style={styles.desc}>{product.description}</Text>
          )}

          {/* Aqui poderás adicionar opções (tamanho, extras) no futuro */}
        </View>
      </ScrollView>

      {/* Barra fixa de adicionar ao pedido */}
      <View style={styles.addBar}>
        <QuantityStepper value={qty} onChange={setQty} />
        <Pressable
          style={[styles.addBtn, qty === 0 && { opacity: 0.5 }]}
          disabled={qty === 0}
          onPress={() => {
            // (Mock) Aqui integrarás com o carrinho (context/estado global) no futuro.
            Alert.alert(
              "Adicionado ao pedido",
              `${qty} × ${product.name} (${formatPriceEUR(total)})`,
            );
            // router.back(); // opcional
          }}
        >
          <Text style={styles.addBtnText}>
            Adicionar ao pedido · {formatPriceEUR(total || product.price)}
          </Text>
        </Pressable>
      </View>
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

  hero: { width: "100%", height: 220, backgroundColor: "#eee" },
  title: { fontSize: 22, fontWeight: "800", color: "#111", marginTop: 12 },
  price: { fontSize: 18, color: "#111", marginTop: 6, fontWeight: "700" },
  desc: { fontSize: 14, color: "#6B7280", marginTop: 8, lineHeight: 20 },

  addBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "800" },
});
