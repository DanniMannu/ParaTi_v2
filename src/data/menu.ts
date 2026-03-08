// src/data/menu.ts
import type { Product } from "../types/product";

export const PRODUCTS: Product[] = [
  // McD
  {
    id: "mcd-bigmac",
    establishmentId: "mcd",
    name: "Big Mac®",
    description:
      "A sanduíche mais famosa do mundo. Dois hambúrgueres, alface, queijo…",
    price: 6.35,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    category: "Sanduíches e McMenu",
    featured: true,
  },
  {
    id: "mcd-cbo",
    establishmentId: "mcd",
    name: "CBO®",
    description: "Peito de frango panado com bacon crocante e molho especial.",
    price: 8.6,
    image:
      "https://images.unsplash.com/photo-1606756790138-261d2b21cd8f?q=80&w=1200&auto=format&fit=crop",
    category: "Sanduíches e McMenu",
    featured: true,
  },
  {
    id: "mcd-double-cheese",
    establishmentId: "mcd",
    name: "Double Cheeseburger",
    description:
      "Dois hambúrgueres 100% carne de vaca cobertos com queijo derretido.",
    price: 6.3,
    image:
      "https://images.unsplash.com/photo-1551782450-17144c3a8f59?q=80&w=1200&auto=format&fit=crop",
    category: "Sanduíches e McMenu",
  },
  {
    id: "mcd-batatas",
    establishmentId: "mcd",
    name: "Batatas Fritas",
    description: "Clássicas, crocantes por fora e macias por dentro.",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1200&auto=format&fit=crop",
    category: "Acompanhamentos",
  },
  {
    id: "mcd-sundae",
    establishmentId: "mcd",
    name: "Sundae",
    description: "Gelado suave com cobertura à escolha.",
    price: 2.3,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop",
    category: "Sobremesas",
  },

  // KEBIZZA (pizza)
  {
    id: "kebizza-margherita",
    establishmentId: "kebizza",
    name: "Pizza Margherita",
    description: "Tomate, mozzarella, manjericão fresco.",
    price: 7.9,
    image:
      "https://images.unsplash.com/photo-1548365328-9f547fb09530?q=80&w=1200&auto=format&fit=crop",
    category: "Pizzas",
    featured: true,
  },
  {
    id: "kebizza-4queijos",
    establishmentId: "kebizza",
    name: "4 Queijos",
    description: "Mistura de queijos selecionados.",
    price: 9.4,
    image:
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1200&auto=format&fit=crop",
    category: "Pizzas",
  },

  // Sushi Go
  {
    id: "sushi-sashimi",
    establishmentId: "sushi-go",
    name: "Sashimi Mix",
    description: "Seleção de sashimi com peixe fresco.",
    price: 12.9,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
    featured: true,
  },
  {
    id: "sushi-uramaki",
    establishmentId: "sushi-go",
    name: "Uramaki Salmão",
    description: "Rolo invertido com salmão e abacate.",
    price: 9.8,
    image:
      "https://images.unsplash.com/photo-1562158070-3bbf0c211cb3?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
];

export function categoriesForEstablishment(establishmentId: string): string[] {
  const cats = new Set<string>();
  PRODUCTS.forEach((p) => {
    if (p.establishmentId === establishmentId) cats.add(p.category);
  });
  return Array.from(cats);
}

export function productsByEstablishment(establishmentId: string) {
  return PRODUCTS.filter((p) => p.establishmentId === establishmentId);
}

export function featuredByEstablishment(establishmentId: string) {
  return PRODUCTS.filter(
    (p) => p.establishmentId === establishmentId && p.featured,
  );
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
