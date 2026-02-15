// app/(restaurante)/schedule.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
} from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ScheduleSettings = {
  restDays: number[]; // 1..7 (Seg..Dom)
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm"
  vacationStart?: string | null; // ISO date
  vacationEnd?: string | null;
};

const STORAGE_KEY = "restaurant_schedule_v1";
const WEEK_DAYS = [
  { id: 1, label: "Seg" },
  { id: 2, label: "Ter" },
  { id: 3, label: "Qua" },
  { id: 4, label: "Qui" },
  { id: 5, label: "Sex" },
  { id: 6, label: "Sáb" },
  { id: 7, label: "Dom" },
];

export default function ScheduleScreen() {
  const [data, setData] = useState<ScheduleSettings>({
    restDays: [],
    openTime: "10:00",
    closeTime: "22:00",
    vacationStart: null,
    vacationEnd: null,
  });
  const [snapshot, setSnapshot] = useState(data);
  const [editing, setEditing] = useState(false);

  // pickers control
  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);
  const [showVacationStart, setShowVacationStart] = useState(false);
  const [showVacationEnd, setShowVacationEnd] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ScheduleSettings = JSON.parse(raw);
        setData(parsed);
        setSnapshot(parsed);
      }
    })();
  }, []);

  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const strToDate = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };
  const toISODate = (d: Date) => {
    const yyyy = d.getFullYear(),
      mm = String(d.getMonth() + 1).padStart(2, "0"),
      dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const prettyDate = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "2-digit",
        })
      : "—";

  // validations
  const isScheduleValid = useMemo(() => {
    const [oh, om] = data.openTime.split(":").map(Number);
    const [ch, cm] = data.closeTime.split(":").map(Number);
    return ch * 60 + cm > oh * 60 + om;
  }, [data.openTime, data.closeTime]);

  const isVacationValid = useMemo(() => {
    if (!data.vacationStart || !data.vacationEnd) return true;
    const s = new Date(data.vacationStart),
      e = new Date(data.vacationEnd);
    const sameMonth =
      s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();
    return sameMonth && e.getTime() >= s.getTime();
  }, [data.vacationStart, data.vacationEnd]);

  const startEdit = () => {
    setSnapshot(data);
    setEditing(true);
  };
  const cancelEdit = () => {
    setData(snapshot);
    setEditing(false);
  };
  const saveEdit = async () => {
    if (!isScheduleValid) {
      Alert.alert("Horário inválido", "Fecho deve ser depois da abertura.");
      return;
    }
    if (!isVacationValid) {
      Alert.alert("Férias inválidas", "Mesmo mês e fim ≥ início.");
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setEditing(false);
      Alert.alert("Guardado", "Horário atualizado.");
    } catch {
      Alert.alert("Erro", "Não foi possível guardar.");
    }
  };

  const toggleRestDay = (id: number) => {
    if (!editing) return;
    setData((s) => {
      const exists = s.restDays.includes(id);
      const restDays = exists
        ? s.restDays.filter((d) => d !== id)
        : [...s.restDays, id];
      return { ...s, restDays: restDays.sort((a, b) => a - b) };
    });
  };

  const onPickOpenTime: IOSNativeProps["onChange"] &
    AndroidNativeProps["onChange"] = (_e, date) => {
    setShowOpenPicker(false);
    if (date) setData((s) => ({ ...s, openTime: fmt(date) }));
  };
  const onPickCloseTime: IOSNativeProps["onChange"] &
    AndroidNativeProps["onChange"] = (_e, date) => {
    setShowClosePicker(false);
    if (date) setData((s) => ({ ...s, closeTime: fmt(date) }));
  };
  const onPickVacationStart: IOSNativeProps["onChange"] &
    AndroidNativeProps["onChange"] = (_e, date) => {
    setShowVacationStart(false);
    if (date) {
      const iso = toISODate(date);
      setData((s) => ({
        ...s,
        vacationStart: iso,
        vacationEnd:
          s.vacationEnd && new Date(s.vacationEnd) < date
            ? null
            : s.vacationEnd,
      }));
    }
  };
  const onPickVacationEnd: IOSNativeProps["onChange"] &
    AndroidNativeProps["onChange"] = (_e, date) => {
    setShowVacationEnd(false);
    if (date) {
      const iso = toISODate(date);
      setData((s) => ({ ...s, vacationEnd: iso }));
    }
  };

  const monthLabel = data.vacationStart
    ? new Date(data.vacationStart).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      {/* Ações */}
      <View style={styles.actionsBar}>
        {!editing ? (
          <TouchableOpacity onPress={startEdit} style={styles.actionBtn}>
            <MaterialCommunityIcons name="pencil" size={16} color="#0F3EA8" />
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

      {/* Dias descanso */}
      <Text style={styles.sectionTitle}>Dias de descanso (semanal)</Text>
      <View style={styles.daysRow}>
        {WEEK_DAYS.map((d) => {
          const active = data.restDays.includes(d.id);
          return (
            <TouchableOpacity
              key={d.id}
              onPress={() => toggleRestDay(d.id)}
              style={[
                styles.dayPill,
                active && styles.dayPillActive,
                !editing && { opacity: 0.5 },
              ]}
              disabled={!editing}
            >
              <Text style={[styles.dayText, active && styles.dayTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Férias */}
      <Text style={styles.sectionTitle}>Férias</Text>
      <View style={[styles.rowBetween, { marginTop: 6 }]}>
        <Text style={styles.muted}>Mês:</Text>
        <Text style={styles.strong}>{monthLabel}</Text>
      </View>

      <View style={[styles.row, { marginTop: 8 }]}>
        <TimeBox
          label="Início"
          value={prettyDate(data.vacationStart)}
          onPress={() => editing && setShowVacationStart(true)}
        />
        <View style={{ width: 12 }} />
        <TimeBox
          label="Fim"
          value={prettyDate(data.vacationEnd)}
          onPress={() => editing && setShowVacationEnd(true)}
        />
      </View>
      {!isVacationValid && (
        <Text style={styles.validation}>Mesmo mês e fim ≥ início.</Text>
      )}
      {showVacationStart && (
        <DateTimePicker
          value={data.vacationStart ? new Date(data.vacationStart) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onPickVacationStart}
        />
      )}
      {showVacationEnd && (
        <DateTimePicker
          value={data.vacationEnd ? new Date(data.vacationEnd) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onPickVacationEnd}
        />
      )}

      {/* Horário */}
      <Text style={styles.sectionTitle}>Horário de funcionamento</Text>
      <View style={styles.row}>
        <TimeBox
          label="Abertura"
          value={data.openTime}
          onPress={() => editing && setShowOpenPicker(true)}
        />
        <View style={{ width: 12 }} />
        <TimeBox
          label="Fecho"
          value={data.closeTime}
          onPress={() => editing && setShowClosePicker(true)}
        />
      </View>
      {!isScheduleValid && (
        <Text style={styles.validation}>
          Fecho deve ser depois de abertura.
        </Text>
      )}

      {showOpenPicker && (
        <DateTimePicker
          value={strToDate(data.openTime)}
          mode="time"
          is24Hour
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onPickOpenTime}
        />
      )}
      {showClosePicker && (
        <DateTimePicker
          value={strToDate(data.closeTime)}
          mode="time"
          is24Hour
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onPickCloseTime}
        />
      )}
    </ScrollView>
  );
}

function TimeBox({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.timeBox}
      activeOpacity={0.7}
    >
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent", padding: 16 },
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

  sectionTitle: {
    marginTop: 10,
    fontSize: 13,
    color: "#374151",
    fontWeight: "700",
  },
  muted: { color: "#6B7280" },
  strong: { fontWeight: "700", color: "#111827" },

  // dias descanso
  daysRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFF",
  },
  dayPillActive: { backgroundColor: "#E8F0FF", borderColor: "#94B3FF" },
  dayText: { color: "#111827", fontWeight: "600" },
  dayTextActive: { color: "#0F3EA8" },

  // time/date boxes
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  timeLabel: { color: "#6B7280", marginBottom: 4, fontSize: 12 },
  timeValue: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  validation: { color: "#DC2626", marginTop: 6 },
});
