// src/components/EstablishmentCard.tsx
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Establishment } from "../types/establishment";
import { formatCount } from "../utils/geo";

type Props = { item: Establishment; onPress?: () => void };

export default function EstablishmentCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          {item.name}
        </Text>
        <Text style={styles.metaLine}>
          <Text style={styles.star}>★</Text> {item.rating.toFixed(1)}
          <Text style={styles.muted}>
            {" "}
            ({formatCount(item.ratingsCount)})
          </Text>{" "}
          · <Text style={styles.muted}>Taxa: </Text>
          {item.fee === 0 ? "Grátis" : `${item.fee.toFixed(2)} MTN`} ·{" "}
          {item.etaMin} min
        </Text>
        <Text numberOfLines={1} style={styles.metaLine}>
          <Text style={styles.muted}>{item.categories.join(" • ")}</Text>
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 140, backgroundColor: "#e9e9ee" },
  ribbon: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: "#111",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ribbonText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  star: { color: "#F59E0B" },
  muted: { color: "#6B7280" },
  metaLine: { marginTop: 2, color: "#111" },
});
