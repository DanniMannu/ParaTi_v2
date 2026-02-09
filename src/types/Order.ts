export type OrderStatus =
  | "pendente" // à espera de ser aceite
  | "aceite" // aceite pelo restaurante
  | "recusado" // recusado
  | "em preparação" // em preparação
  | "pronto" // pronto para recolha/entrega
  | "cancelado"; // cancelado

export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number; // preço unitário
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string; // ISO date
  status: OrderStatus;
};
