import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Logout() {
  const handleConfirm = async () => {
    try {
      // Limpa valores que quiseres (opcional)
      await AsyncStorage.removeItem("courier.availability");
      // await AsyncStorage.removeItem("courier.profile.v1");

      // Volta ao início (ou login)
      router.replace("/");
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível terminar a sessão.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terminar Sessão</Text>

      <Text style={styles.warning}>
        Tens a certeza que queres terminar a sessão?
      </Text>

      <View style={{ height: 24 }} />

      <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmTxt}>Confirmar</Text>
      </Pressable>

      <Pressable style={[styles.cancelBtn]} onPress={() => router.back()}>
        <Text style={styles.cancelTxt}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFF",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  warning: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  confirmTxt: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "800",
  },
  cancelBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  cancelTxt: {
    textAlign: "center",
    color: "#111827",
    fontWeight: "800",
  },
});
