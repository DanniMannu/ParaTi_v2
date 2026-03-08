// src/data/establishments.ts
import type { Coords, Establishment } from "../types/establishment";

// Morada e localização default (mock)
export const MOCK_DEFAULT_ADDRESS = "Avenida Doutor Fernando, 123, Marteleira";
export const MOCK_USER_LOCATION: Coords = { lat: 39.2334, lon: -9.2572 }; // aprox. Marteleira

// "Geocodificação" mock para troca de morada
export const GEOCODE_MOCKS: Record<string, Coords> = {
  "Avenida Doutor Fernando, 123, Marteleira": { lat: 39.2334, lon: -9.2572 },
  "Centro de Lisboa": { lat: 38.7223, lon: -9.1393 },
  "Porto - Baixa": { lat: 41.1476, lon: -8.6071 },
};

export const CATEGORIES_UI: { key: string; label: string; icon: string }[] = [
  { key: "Asiática", label: "Asiática", icon: "🍜" },
  { key: "Pizza", label: "Pizza", icon: "🍕" },
  { key: "Sobremesas", label: "Sobremesas", icon: "🍪" },
  { key: "Saudável", label: "Saudável", icon: "🥗" },
  { key: "Fast food", label: "Fast food", icon: "🍟" },
  { key: "Hambúrguer", label: "Hambúrguer", icon: "🍔" },
];

export const MOCK_ESTABLISHMENTS: Establishment[] = [
  {
    id: "kebizza",
    name: "KEBIZZA",
    image:
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1200&auto=format&fit=crop",
    rating: 4.5,
    ratingsCount: 130,
    fee: 0.9,
    etaMin: 14,
    coords: { lat: 39.2355, lon: -9.2551 },
    categories: ["Pizza"],
    sponsored: true,
    products: ["pizza kebab", "calzone", "4 queijos", "margarita"],
  },
  {
    id: "mcd",
    name: "McDonald's®",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    rating: 4.4,
    ratingsCount: 40000,
    fee: 0.0,
    etaMin: 12,
    coords: { lat: 39.2309, lon: -9.2602 },
    categories: ["Fast food", "Hambúrguer"],
    sponsored: true,
    products: ["big mac", "batatas fritas", "nuggets", "sundae"],
  },
  {
    id: "sushi-go",
    name: "Sushi Go",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    ratingsCount: 820,
    fee: 1.2,
    etaMin: 22,
    coords: { lat: 39.233, lon: -9.249 },
    categories: ["Asiática", "Sushi"],
    products: ["sashimi", "temaki", "uramaki", "gunkan"],
  },
  {
    id: "pizzarte",
    name: "PizzArte",
    image:
      "https://images.unsplash.com/photo-1541745537413-b804f1a60d3f?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    ratingsCount: 540,
    fee: 0.0,
    etaMin: 18,
    coords: { lat: 39.241, lon: -9.265 },
    categories: ["Pizza"],
    products: ["pepperoni", "fungi", "trufada"],
  },
  {
    id: "green-bowl",
    name: "Green Bowl",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    ratingsCount: 210,
    fee: 0.7,
    etaMin: 16,
    coords: { lat: 39.226, lon: -9.253 },
    categories: ["Saudável"],
    products: ["poke", "salada", "wrap vegan"],
  },
  {
    id: "sweet-bite",
    name: "Sweet Bite",
    image:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
    rating: 4.3,
    ratingsCount: 90,
    fee: 0.5,
    etaMin: 15,
    coords: { lat: 39.238, lon: -9.251 },
    categories: ["Sobremesas"],
    products: ["brownie", "cheesecake", "gelado artesanal"],
  },
  {
    id: "burger-lab",
    name: "Burger Lab",
    image:
      "https://images.unsplash.com/photo-1550547660-8b1f9b6ad5e1?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    ratingsCount: 1800,
    fee: 0.9,
    etaMin: 20,
    coords: { lat: 39.221, lon: -9.27 },
    categories: ["Hambúrguer", "Fast food"],
    products: ["smash burger", "onion rings", "milkshake"],
  },
  {
    id: "taco-truck",
    name: "Taco Truck",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1200&auto=format&fit=crop",
    rating: 4.2,
    ratingsCount: 340,
    fee: 0.0,
    etaMin: 19,
    coords: { lat: 39.219, lon: -9.24 },
    categories: ["Fast food"],
    products: ["taco", "burrito", "quesadilla"],
  },
];

/* --------- (Futuro) Supabase: exemplo de fetch pronto a usar -------------
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!);

export async function fetchEstablishments(): Promise<Establishment[]> {
  const { data, error } = await supabase
    .from('establishments')
    .select('id,name,image,rating,ratingsCount,fee,etaMin,lat,lon,categories,sponsored,products');
  if (error) throw error;
  return (data ?? []).map(d => ({
    id: d.id,
    name: d.name,
    image: d.image,
    rating: d.rating,
    ratingsCount: d.ratingsCount,
    fee: d.fee,
    etaMin: d.etaMin,
    coords: { lat: d.lat, lon: d.lon },
    categories: d.categories ?? [],
    sponsored: d.sponsored ?? false,
    products: d.products ?? [],
  }));
}
-------------------------------------------------------------------------- */
