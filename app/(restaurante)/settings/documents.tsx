// app/(restaurante)/documents.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/** Em produção, isto virá da API */
type Doc = { id: string; name: string; uri: string; updatedAt: string };
const MOCK_DOCS: Doc[] = [
  {
    id: "1",
    name: "Contrato de Prestação de Serviços.pdf",
    uri: "https://example.com/contrato.pdf",
    updatedAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Licença Sanitária.pdf",
    uri: "https://example.com/licenca.pdf",
    updatedAt: "2025-09-10",
  },
];

export default function DocumentsScreen() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    setDocs(MOCK_DOCS);
  }, []);

  const openUri = async (uri: string) => {
    const supported = await Linking.canOpenURL(uri);
    if (supported) Linking.openURL(uri);
    else Alert.alert("Não é possível abrir este ficheiro neste dispositivo.");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text style={styles.info}>
        Os documentos abaixo são disponibilizados pelos proprietários da
        aplicação. Podes apenas visualizar.
      </Text>

      {docs.map((d) => (
        <View key={d.id} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName} numberOfLines={2}>
              {d.name}
            </Text>
            <Text style={styles.updated}>
              Atualizado em {new Date(d.updatedAt).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => openUri(d.uri)}
            style={styles.viewBtn}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="eye-outline"
              size={18}
              color="#1D4ED8"
            />
            <Text style={styles.viewBtnText}>Ver</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  info: { color: "#6B7280", marginBottom: 12 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  docName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  updated: { color: "#6B7280", marginTop: 2, fontSize: 12 },
  viewBtn: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewBtnText: { color: "#1D4ED8", fontWeight: "700" },
});
