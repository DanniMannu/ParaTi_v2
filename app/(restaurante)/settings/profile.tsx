// app/(restaurante)/profile.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CuisineType =
  | "Variado"
  | "Halal"
  | "Vegan"
  | "Vegetariano"
  | "Gluten Free";
type ProfileSettings = {
  name: string;
  photoUri?: string | null;
  address: string;
  cuisine: CuisineType;
};

const STORAGE_KEY = "restaurant_profile_v1";
const CUISINE_OPTIONS: CuisineType[] = [
  "Variado",
  "Halal",
  "Vegan",
  "Vegetariano",
  "Gluten Free",
];

export default function ProfileScreen() {
  const [data, setData] = useState<ProfileSettings>({
    // Pré-preenchido (em produção virá do backend)
    name: "Restaurante da Praça",
    photoUri: null,
    address: "Rua das Flores 123, Porto",
    cuisine: "Variado",
  });
  const [snapshot, setSnapshot] = useState<ProfileSettings>(data);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ProfileSettings = JSON.parse(raw);
        setData(parsed);
        setSnapshot(parsed);
      }
    })();
  }, []);

  const startEdit = () => {
    setSnapshot(data); // guarda cópia para cancelar
    setEditing(true);
  };

  const cancelEdit = () => {
    setData(snapshot);
    setEditing(false);
  };

  const saveEdit = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setEditing(false);
      Alert.alert("Guardado", "Perfil atualizado com sucesso.");
    } catch {
      Alert.alert("Erro", "Não foi possível guardar o perfil.");
    }
  };

  const pickPhoto = async () => {
    if (!editing) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permissão", "Autorize acesso às fotos.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!res.canceled && res.assets?.[0]) {
      setData((s) => ({ ...s, photoUri: res.assets![0].uri }));
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Barra de ações */}
      <View style={styles.actionsBar}>
        {!editing ? (
          <TouchableOpacity onPress={startEdit} style={styles.actionBtn}>
            <MaterialCommunityIcons name="pencil" size={13} color="#0F3EA8" />
            <Text style={styles.actionBtnText}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={cancelEdit}
              style={[styles.actionBtn, styles.actionBtnGray]}
            >
              <Text style={[styles.actionBtnText, { color: "#111827" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveEdit} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Foto */}
      <Text style={styles.label}>Foto de perfil</Text>
      <View style={styles.photoRow}>
        <TouchableOpacity onPress={pickPhoto} activeOpacity={0.8}>
          <View
            style={[
              styles.photoCircle,
              !data.photoUri && {
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            {data.photoUri ? (
              <Image source={{ uri: data.photoUri }} style={styles.photoImg} />
            ) : (
              <MaterialCommunityIcons
                name="image-outline"
                size={34}
                color="#6B7280"
              />
            )}
          </View>
          {editing && (
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={14} color="#0F3EA8" />
              <Text style={styles.editBadgeText}>Alterar</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Nome */}
      <Text style={styles.label}>Nome do restaurante</Text>
      <TextInput
        style={[styles.input, !editing && styles.inputDisabled]}
        editable={editing}
        placeholder="Ex.: Dona Maria - Cozinha Caseira"
        value={data.name}
        onChangeText={(t) => setData((s) => ({ ...s, name: t }))}
      />

      {/* Endereço */}
      <Text style={styles.label}>Endereço</Text>
      <TextInput
        style={[styles.input, !editing && styles.inputDisabled]}
        editable={editing}
        placeholder="Rua, número, bairro, cidade"
        value={data.address}
        onChangeText={(t) => setData((s) => ({ ...s, address: t }))}
        multiline
      />

      {/* Tipo de comida */}
      <Text style={styles.label}>Tipo de comida</Text>
      <Text style={styles.help}>
        Escolhe <Text style={{ fontWeight: "700" }}>Variado</Text> a menos que
        sejas 100% de um tipo (ex.: Vegan 100%).
      </Text>
      <View style={{ marginTop: 8 }}>
        {CUISINE_OPTIONS.map((c) => {
          const selected = data.cuisine === c;
          return (
            <TouchableOpacity
              key={c}
              disabled={!editing}
              onPress={() => setData((s) => ({ ...s, cuisine: c }))}
              style={styles.radioRow}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.radioOuter,
                  selected && styles.radioOuterActive,
                  !editing && { opacity: 0.5 },
                ]}
              >
                {selected && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  actionsBar: { alignItems: "flex-end", marginBottom: 8 },
  actionBtn: {
    backgroundColor: "#E7EEFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtnGray: { backgroundColor: "#F3F4F6" },
  actionBtnText: { color: "#0F3EA8", fontWeight: "800" },

  label: {
    fontSize: 13,
    color: "#374151",
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 48,
    backgroundColor: "#FFF",
  },
  inputDisabled: { backgroundColor: "#F9FAFB", color: "#6B7280" },
  help: { color: "#6B7280" },

  photoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  photoImg: { width: "100%", height: "100%" },
  editBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#E7EEFF",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editBadgeText: { color: "#0F3EA8", fontWeight: "800" },

  radioRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioOuterActive: { borderColor: "#2563EB" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  radioLabel: { fontSize: 16, color: "#111827" },
});
