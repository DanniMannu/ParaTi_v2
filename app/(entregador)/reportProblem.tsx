import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

/**
 * Altera para o teu e-mail de suporte
 */
const SUPPORT_EMAIL = "dmcaa@iscte-iul.pt";

type ReasonId =
  | "restaurante-fechado"
  | "pedido-nao-pronto"
  | "cliente-nao-atende"
  | "endereco-errado"
  | "pagamento"
  | "problema-pessoal"
  | "outro";

type Reason = { id: ReasonId; emoji: string; label: string };

// Cards grandes (1 toque = 1 escolha)
const REASONS: Reason[] = [
  { id: "restaurante-fechado", emoji: "🏪", label: "Restaurante fechado" },
  { id: "pedido-nao-pronto", emoji: "📦", label: "Pedido não pronto" },
  { id: "cliente-nao-atende", emoji: "🧍", label: "Cliente não atende" },
  { id: "endereco-errado", emoji: "📍", label: "Endereço errado" },
  { id: "pagamento", emoji: "💸", label: "Pagamento" },
  { id: "problema-pessoal", emoji: "🚲", label: "Problema pessoal" },
  { id: "outro", emoji: "⚠️", label: "Outro" },
];

export default function ReportProblem() {
  // Step: 'select' | 'details'
  const [step, setStep] = useState<"select" | "details">("select");
  const [selected, setSelected] = useState<ReasonId | null>(null);

  // Detalhes
  const [details, setDetails] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Botões desativados?
  const canContinue = useMemo(() => !!selected, [selected]);
  const canSend = useMemo(() => details.trim().length >= 1, [details]);

  // Selecionar imagem (opcional)
  const pickImage = async () => {
    try {
      // Pedido de permissão
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Autoriza o acesso às imagens para anexar uma foto.",
        );
        return;
      }

      // Nota: MediaTypeOptions é suportado e evita erros (pode mostrar aviso de deprecated em SDKs mais recentes)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const handleContinue = () => {
    if (!selected) {
      Alert.alert(
        "Seleciona uma opção",
        "Escolhe o tipo de problema para continuar.",
      );
      return;
    }
    setStep("details");
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("select");
      return;
    }
  };

  const handleSend = async () => {
    if (!selected) {
      Alert.alert("Seleciona uma opção", "Escolhe o tipo de problema.");
      return;
    }
    if (!canSend) {
      Alert.alert("Falta descrição", "Explica rapidamente o que aconteceu.");
      return;
    }

    const reasonLabel = REASONS.find((r) => r.id === selected)?.label ?? "—";
    const subject = `Problema: ${reasonLabel}`;

    const body =
      `Motivo: ${reasonLabel}\n` +
      `Plataforma: ${Platform.OS}\n` +
      (imageUri ? `Foto (URI local): ${imageUri}\n` : "") +
      `\nDetalhes:\n${details}`;

    const mailto =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    try {
      const can = await Linking.canOpenURL(mailto);
      if (can) {
        await Linking.openURL(mailto);
        Alert.alert(
          "Obrigado",
          "Abrimos o teu cliente de e‑mail com o reporte preparado.",
        );
      } else {
        Alert.alert(
          "Aviso",
          "Não foi possível abrir o cliente de e‑mail. Copia o texto e envia manualmente para " +
            SUPPORT_EMAIL,
        );
      }
    } catch {
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao iniciar o envio. Tenta novamente.",
      );
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {step === "select" ? (
        <>
          <Text style={styles.title}>Qual é o problema?</Text>

          {/* Grid de cards grandes (full-width empilhados para simplicidade e legibilidade) */}
          <View style={{ marginTop: 8 }}>
            {REASONS.map((r) => {
              const active = selected === r.id;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => setSelected(r.id)}
                  style={[styles.reasonCard, active && styles.reasonCardActive]}
                  android_ripple={{ color: "#E5E7EB" }}
                >
                  <Text style={styles.reasonEmoji}>{r.emoji}</Text>
                  <Text
                    style={[
                      styles.reasonText,
                      active && styles.reasonTextActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Botão Continuar (em baixo do conteúdo) */}
          <Pressable
            onPress={handleContinue}
            disabled={!canContinue}
            style={[
              styles.primaryBtn,
              !canContinue && styles.primaryBtnDisabled,
              { marginTop: 16 },
            ]}
          >
            <Text style={styles.primaryBtnText}>Continuar</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>Detalhes do problema</Text>
          <Text style={styles.helper}>Explica rapidamente o que aconteceu</Text>

          {/* Campo texto 2–3 linhas */}
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Escreve aqui (2–3 linhas)…"
            style={[styles.input, styles.textarea]}
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Foto opcional */}
          {imageUri ? (
            <View style={styles.previewRow}>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <Pressable
                onPress={() => setImageUri(null)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>Remover foto</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={pickImage}
              style={[styles.secondaryBtn, { alignSelf: "flex-start" }]}
            >
              <Text style={styles.secondaryBtnText}>
                📷 Adicionar foto (opcional)
              </Text>
            </Pressable>
          )}

          {/* Ações: Voltar / Enviar */}
          <View style={styles.actionsRow}>
            <Pressable onPress={handleBack} style={[styles.ghostBtn]}>
              <Text style={styles.ghostBtnText}>Voltar</Text>
            </Pressable>

            <Pressable
              onPress={handleSend}
              disabled={!canSend}
              style={[styles.primaryBtn, !canSend && styles.primaryBtnDisabled]}
            >
              <Text style={styles.primaryBtnText}>Enviar reporte</Text>
            </Pressable>
          </View>
        </>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7FAFF",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 16,
  },

  // Títulos e texto
  title: { fontSize: 24, fontWeight: "800", color: "#111827" },
  helper: { marginTop: 6, marginBottom: 12, color: "#6B7280" },

  // Cards de motivo
  reasonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  reasonCardActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  reasonEmoji: { fontSize: 20, marginRight: 12 },
  reasonText: { fontSize: 16, color: "#111827", fontWeight: "700" },
  reasonTextActive: { color: "#1D4ED8" },

  // Inputs
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
  },
  textarea: { minHeight: 80 },

  // Preview da foto + botão remover
  previewRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  preview: {
    width: 84,
    height: 84,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },

  // Botões
  primaryBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "800" },

  secondaryBtn: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  secondaryBtnText: { color: "#111827", fontWeight: "700" },

  ghostBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  ghostBtnText: { color: "#111827", fontWeight: "700" },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
