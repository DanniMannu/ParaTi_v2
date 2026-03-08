// src/components/QuantityStepper.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  value: number;
  min?: number; // default 0
  onChange: (next: number) => void;
  size?: "sm" | "md";
};

export default function QuantityStepper({
  value,
  min = 0,
  onChange,
  size = "md",
}: Props) {
  const canDec = value > min;
  const btnSize = size === "sm" ? 34 : 40;
  const font = size === "sm" ? 18 : 20;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => canDec && onChange(value - 1)}
        style={[
          styles.btn,
          { width: btnSize, height: btnSize, opacity: canDec ? 1 : 0.4 },
        ]}
        hitSlop={8}
      >
        <Text style={[styles.txt, { fontSize: font }]}>−</Text>
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        style={[styles.btn, { width: btnSize, height: btnSize }]}
        hitSlop={8}
      >
        <Text style={[styles.txt, { fontSize: font }]}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  btn: {
    backgroundColor: "#111",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: { color: "#fff", fontWeight: "700" },
  value: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
});
