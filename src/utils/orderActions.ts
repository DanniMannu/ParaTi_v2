/*gestão do ciclo de vida do pedido */
import { Order } from "../types/Order";

export function acceptOrder(order: Order): Order {
  return { ...order, status: "aceite" };
}

export function rejectOrder(order: Order): Order {
  return { ...order, status: "recusado" };
}

export function startPreparing(order: Order): Order {
  return { ...order, status: "em preparação" };
}

export function markAsReady(order: Order): Order {
  return { ...order, status: "pronto" };
}

export function cancelOrder(order: Order): Order {
  return { ...order, status: "cancelado" };
}

/**calcular o tempo desde a receção */
export function getMinutesSince(dateIso: string): number {
  const created = new Date(dateIso).getTime();
  const now = Date.now();
  const diffMs = now - created;
  return Math.max(0, Math.floor(diffMs / 60000));
}
