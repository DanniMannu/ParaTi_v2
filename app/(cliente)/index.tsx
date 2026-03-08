// app/(client)/index.tsx
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EstablishmentCard from "../../src/components/EstablishmentCard";
import {
  CATEGORIES_UI,
  GEOCODE_MOCKS,
  MOCK_DEFAULT_ADDRESS,
  MOCK_ESTABLISHMENTS,
  MOCK_USER_LOCATION,
} from "../../src/data/establishments";
import type { Coords, Establishment } from "../../src/types/establishment";
import { haversineKm } from "../../src/utils/geo";

function Section({
  title,
  data,
  onMore,
  onPressCard,
}: {
  title: string;
  data: Establishment[];
  onMore?: () => void;
  onPressCard?: (e: Establishment) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable hitSlop={8} onPress={onMore}>
          <Text style={styles.sectionMore}>Ver tudo ▸</Text>
        </Pressable>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
        renderItem={({ item }) => (
          <EstablishmentCard item={item} onPress={() => onPressCard?.(item)} />
        )}
      />
    </View>
  );
}

export default function ClientHome() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState<string>(MOCK_DEFAULT_ADDRESS);
  const [coords, setCoords] = useState<Coords>(MOCK_USER_LOCATION);

  // Modal (mock) para alterar morada
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [pendingAddr, setPendingAddr] = useState(address);

  const sponsored = useMemo(
    () => MOCK_ESTABLISHMENTS.filter((e) => e.sponsored),
    [],
  );

  const nearby = useMemo(() => {
    return MOCK_ESTABLISHMENTS.map((e) => ({
      e,
      d: haversineKm(coords, e.coords),
    }))
      .filter((x) => x.d <= 15) // raio de 15 km
      .sort((a, b) => a.d - b.d)
      .map((x) => x.e);
  }, [coords]);

  const youMayLike = useMemo(() => {
    const shuffled = [...MOCK_ESTABLISHMENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  }, []);

  const goList = useCallback(
    (
      mode: "nearby" | "sponsored" | "all" | "category" | "search",
      extra?: any,
    ) => {
      router.push({
        pathname: "./estabelecimentos-lista",
        params: { mode, extra: extra ? JSON.stringify(extra) : "" },
      });
    },
    [router],
  );

  const goEstablishment = useCallback(
    (id: string) => {
      router.push({
        pathname: "./estabelecimento/establishmentOverview",
        params: { id },
      });
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Pesquisa: produto ou estabelecimento */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Procurar produto ou estabelecimento"
              placeholderTextColor="#8E8E93"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => {
                const q = search.trim();
                if (!q) return;
                goList("search", { q });
              }}
              returnKeyType="search"
            />
          </View>
          <Pressable
            style={styles.roundBtn}
            onPress={() => {
              /* tipo de entrega no futuro */
            }}
          >
            <Text style={styles.roundBtnText}>🚚</Text>
          </Pressable>
          <Pressable
            style={styles.roundBtn}
            onPress={() => {
              /* carrinho */
            }}
          >
            <Text style={styles.roundBtnText}>🛒</Text>
          </Pressable>
        </View>

        {/* Morada e seta para selecionar outra (abre modal mock) */}
        <Pressable
          style={styles.deliveryRow}
          onPress={() => {
            setPendingAddr(address);
            setShowAddressModal(true);
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.deliveryLine1}>Entregar agora</Text>
            <Text style={styles.chev}> ▾</Text>
          </View>
          <Text numberOfLines={1} style={styles.deliveryLine2}>
            {address} • Entrega
          </Text>
        </Pressable>

        {/* Categorias -> abrir lista filtrada */}
        <FlatList
          data={CATEGORIES_UI}
          keyExtractor={(i) => i.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => (
            <Pressable
              style={styles.catChip}
              onPress={() => goList("category", { category: item.key })}
            >
              <Text style={styles.catIcon}>{item.icon}</Text>
              <Text style={styles.catLabel}>{item.label}</Text>
            </Pressable>
          )}
        />

        {/* Secções */}
        <Section
          title="Em Destaque ParaTi"
          data={sponsored}
          onMore={() => goList("sponsored")}
          onPressCard={(it) => goEstablishment(it.id)}
        />

        <Section
          title="Estabelecimentos perto de ti"
          data={nearby}
          onMore={() => goList("nearby", { radiusKm: 15 })}
          onPressCard={(it) => goEstablishment(it.id)}
        />

        <Section
          title="Locais de que poderás gostar"
          data={youMayLike}
          onMore={() => goList("all")}
          onPressCard={(it) => goEstablishment(it.id)}
        />

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Modal para trocar morada (mock) */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Definir outra morada</Text>
            <View style={styles.modalInputWrap}>
              <TextInput
                value={pendingAddr}
                onChangeText={setPendingAddr}
                placeholder="Introduz a morada"
                style={styles.modalInput}
              />
            </View>
            <View style={styles.modalRow}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#E5E7EB" }]}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: "#111" }]}>
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#111" }]}
                onPress={() => {
                  const newAddr = pendingAddr.trim();
                  if (!newAddr) return;
                  setAddress(newAddr);
                  const newCoords = GEOCODE_MOCKS[newAddr];
                  if (newCoords) setCoords(newCoords); // atualiza "perto de ti"
                  setShowAddressModal(false);
                }}
              >
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                  Guardar
                </Text>
              </Pressable>
            </View>
            <Text style={styles.modalHint}>
              (Mock) Exemplos:{"\n"}• {Object.keys(GEOCODE_MOCKS).join("\n• ")}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* -------------------------------- STYLES --------------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: 8 },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 16, color: "#111" },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  roundBtnText: { fontSize: 18 },
  deliveryRow: { paddingHorizontal: 16, paddingTop: 6 },
  deliveryLine1: { fontSize: 13, color: "#111", fontWeight: "600" },
  deliveryLine2: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  chev: { color: "#6B7280" },

  catList: { paddingHorizontal: 8, paddingTop: 10, paddingBottom: 2, gap: 8 },
  catChip: { alignItems: "center", marginHorizontal: 8 },
  catIcon: { fontSize: 22, textAlign: "center" },
  catLabel: { fontSize: 12, color: "#111", marginTop: 4 },

  section: { marginTop: 8 },
  sectionHead: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  sectionMore: { fontSize: 13, color: "#6B7280" },
  cardsRow: { paddingHorizontal: 8, gap: 12, paddingBottom: 6 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  modalInputWrap: {
    marginTop: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  modalInput: { height: 44, fontSize: 15, color: "#111" },
  modalRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    justifyContent: "flex-end",
  },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  modalBtnText: { fontSize: 14, fontWeight: "700" },
  modalHint: { marginTop: 10, color: "#6B7280", fontSize: 12 },
});
