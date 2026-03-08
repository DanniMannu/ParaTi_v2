// src/types/establishment.ts
export type Coords = { lat: number; lon: number };

export type Establishment = {
  id: string;
  name: string;
  image: string;
  rating: number;
  ratingsCount: number;
  fee: number; // taxa de entrega (MTN)
  etaMin: number; // tempo estimado (min)
  coords: Coords; // localização do estabelecimento
  categories: string[]; // ex.: ['Asiática', 'Sushi']
  sponsored?: boolean; // Em destaque (pago)
  products: string[]; // nomes/keywords de produtos (para pesquisa)
};
