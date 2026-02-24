import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type VehicleType = "bike" | "moto" | "car";
type CourierProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicle: VehicleType;
  plate?: string;
  photoUri?: string | null;
};

const STORAGE_KEY = "courier.profile.v1";

export default function Profile() {
  const [profile, setProfile] = useState<CourierProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    vehicle: "moto",
    plate: "",
    photoUri: null,
  });
  const [original, setOriginal] = useState<CourierProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Carregar perfil do storage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CourierProfile;
          setProfile((p) => ({ ...p, ...parsed }));
          setOriginal(parsed);
        }
      } catch {
        // ignora
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setField = <K extends keyof CourierProfile>(
    key: K,
    value: CourierProfile[K],
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const vehicleLabel = (v: VehicleType) =>
    v === "bike" ? "Bicicleta" : v === "moto" ? "Moto" : "Carro";

  const isValidEmail = (e: string) => (e ? /\S+@\S+\.\S+/.test(e) : true);
  const canSave = useMemo(() => {
    if (!profile.firstName.trim()) return false;
    if (!isValidEmail(profile.email)) return false;
    if (profile.phone && profile.phone.trim().length < 7) return false;
    return true;
  }, [profile.firstName, profile.email, profile.phone]);

  const onEdit = () => {
    setOriginal(profile); // guarda snapshot para cancelar
    setEditing(true);
  };

  const onCancel = () => {
    if (original) setProfile(original);
    setEditing(false);
  };

  const onSave = async () => {
    if (!canSave) {
      Alert.alert("Dados inválidos", "Verifica o nome, telefone e e‑mail.");
      return;
    }
    setSaving(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setOriginal(profile);
      setEditing(false);
      Alert.alert("Guardado", "As tuas alterações foram guardadas.");
    } catch {
      Alert.alert("Erro", "Não foi possível guardar. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  };

  const pickPhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Autoriza o acesso às imagens para alterar a foto.",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setField("photoUri", result.assets[0].uri);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const removePhoto = () => setField("photoUri", null);

  if (loading) return <View style={{ flex: 1, backgroundColor: "#F7FAFF" }} />;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header: título + (Guardar/Cancelar quando editar) */}
      <View style={styles.headerRow}>
        {editing && (
          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={onCancel}
              style={[styles.ghostBtn, { marginRight: 8 }]}
            >
              <Text style={styles.ghostBtnText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onSave}
              disabled={!canSave || saving}
              style={[
                styles.primaryBtn,
                (!canSave || saving) && styles.primaryBtnDisabled,
              ]}
            >
              <Text style={styles.primaryBtnText}>
                {saving ? "A guardar..." : "Guardar"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Foto + Editar na mesma linha (editar à direita) */}
      <View style={styles.avatarRow}>
        <View style={styles.rowLeft}>
          <View style={styles.avatarFrame}>
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarPlaceholder}>👤</Text>
            )}
          </View>

          {/* Ações de foto apenas em modo edição */}
          {editing && (
            <View style={{ marginLeft: 12 }}>
              <Pressable onPress={pickPhoto} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Alterar foto</Text>
              </Pressable>
              {profile.photoUri ? (
                <Pressable
                  onPress={removePhoto}
                  style={[styles.ghostBtn, { marginTop: 6 }]}
                >
                  <Text style={styles.ghostBtnText}>Remover foto</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>

        {/* Botão Editar do lado oposto (só quando NÃO estás a editar) */}
        {!editing && (
          <Pressable onPress={onEdit} style={styles.editBtn}>
            <Text style={styles.editBtnText}>Editar</Text>
          </Pressable>
        )}
      </View>

      {/* MODO VISUALIZAÇÃO */}
      {!editing && (
        <>
          <Section title="Identificação">
            <InfoRow label="Nome" value={profile.firstName || "—"} />
            <InfoRow label="Apelido" value={profile.lastName || "—"} />
          </Section>

          <Section title="Contacto">
            <InfoRow label="Telemóvel" value={profile.phone || "—"} />
            <InfoRow label="E‑mail" value={profile.email || "—"} />
          </Section>

          <Section title="Entrega">
            <InfoRow label="Veículo" value={vehicleLabel(profile.vehicle)} />
            <InfoRow
              label="Matrícula"
              value={
                profile.plate ||
                (profile.vehicle === "bike" ? "Não aplicável" : "—")
              }
            />
          </Section>

          <Text style={styles.note}>
            Documentos oficiais são geridos pelos administradores. Podes apenas
            visualizar o estado.
          </Text>
        </>
      )}

      {/* MODO EDIÇÃO */}
      {editing && (
        <>
          <Section title="Identificação">
            <LabeledInput
              label="Nome"
              value={profile.firstName}
              onChangeText={(t) => setField("firstName", t)}
              placeholder="Ex.: Daniela"
            />
            <LabeledInput
              label="Apelido"
              value={profile.lastName}
              onChangeText={(t) => setField("lastName", t)}
              placeholder="Ex.: Chichava"
            />
          </Section>

          <Section title="Contacto">
            <LabeledInput
              label="Telemóvel"
              value={profile.phone}
              onChangeText={(t) => setField("phone", t)}
              placeholder="Ex.: +258 84 123 4567"
              keyboardType="phone-pad"
            />
            <LabeledInput
              label="E‑mail"
              value={profile.email}
              onChangeText={(t) => setField("email", t)}
              placeholder="Ex.: daniela@exemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Section>

          <Section title="Entrega">
            {/* Chips de veículo */}
            <Text style={styles.label}>Veículo</Text>
            <View style={styles.chipsRow}>
              {(["bike", "moto", "car"] as VehicleType[]).map((v) => {
                const active = profile.vehicle === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => setField("vehicle", v)}
                    style={[styles.chip, active && styles.chipActive]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {v === "bike"
                        ? "Bicicleta"
                        : v === "moto"
                          ? "Moto"
                          : "Carro"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <LabeledInput
              label="Matrícula (opcional)"
              value={profile.plate}
              onChangeText={(t) => setField("plate", t)}
              placeholder={
                profile.vehicle === "bike" ? "Não aplicável" : "Ex.: ABC‑123‑XY"
              }
              autoCapitalize="characters"
            />
          </Section>
        </>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

/* ---------- Sub-componentes ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function LabeledInput(
  props: {
    label: string;
    value: string | undefined;
    onChangeText: (t: string) => void;
  } & React.ComponentProps<typeof TextInput>,
) {
  const { label, ...rest } = props;
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        style={[styles.input, (rest as any).style]}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

/* ---------- Estilos ---------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7FAFF" },
  container: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 28, fontWeight: "800", color: "#111827" },
  subtitle: { marginTop: 4, marginBottom: 12, color: "#6B7280" },

  // Avatar + Editar na mesma linha
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // empurra o Editar para a direita
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  avatarFrame: {
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: { width: 84, height: 84 },
  avatarPlaceholder: { fontSize: 36 },

  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    color: "#1F2937",
    fontWeight: "700",
  },

  // Visualização
  infoRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: { color: "#6B7280" },
  infoValue: { color: "#111827", fontWeight: "700" },

  // Labels/inputs
  label: { color: "#374151", fontWeight: "700", marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#111827",
  },

  // Chips
  chipsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 4 },
  chip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { color: "#111827", fontWeight: "700" },
  chipTextActive: { color: "#FFFFFF" },

  // Botões
  editBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editBtnText: { color: "#FFFFFF", fontWeight: "800" },

  primaryBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "800" },

  secondaryBtn: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryBtnText: { color: "#111827", fontWeight: "700" },

  ghostBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  ghostBtnText: { color: "#111827", fontWeight: "700" },

  note: { color: "#6B7280", marginTop: 12, fontSize: 12 },
});
