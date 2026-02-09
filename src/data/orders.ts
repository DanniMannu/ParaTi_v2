/**Data para teste por ausência de backend */
import { Order } from "../types/Order";

export const mockOrders: Order[] = [
  {
    id: "1",
    status: "pendente",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // há 5min
    total: 22.5,
    items: [
      { id: "p1", name: "Pizza Margherita", qty: 1, price: 12.5 },
      { id: "p2", name: "Coca-Cola", qty: 2, price: 2.5 },
      { id: "p3", name: "Brownie", qty: 1, price: 5.0 },
    ],
  },
  {
    id: "2",
    status: "aceite",
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(), // há 18min
    total: 17.0,
    items: [
      { id: "p1", name: "Hambúrguer Clássico", qty: 1, price: 10 },
      { id: "p2", name: "Batatas Fritas", qty: 1, price: 3 },
      { id: "p3", name: "Sumo", qty: 1, price: 4 },
    ],
  },
];

export const mockHistory: Order[] = [
  {
    id: "3",
    status: "pronto",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(), // há 2h
    total: 27.0,
    items: [
      { id: "p1", name: "Wrap Frango", qty: 1, price: 7 },
      { id: "p2", name: "Ice Tea", qty: 1, price: 20 },
    ],
  },
];
