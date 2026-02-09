import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "support_tickets_v1";

export type SupportTicket = {
  orderId: string;
  requestedAt: string; // ISO
};

export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addSupportTicket(orderId: string) {
  const list = await getSupportTickets();
  if (!list.some((t) => t.orderId === orderId)) {
    list.push({ orderId, requestedAt: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export async function hasSupportTicket(orderId: string) {
  const list = await getSupportTickets();
  return list.some((t) => t.orderId === orderId);
}

/** Remove ticket quando o pedido terminar (ready/rejected/cancelled). */
export async function clearSupportTicket(orderId: string) {
  const list = await getSupportTickets();
  const next = list.filter((t) => t.orderId !== orderId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
