// src/types/product.ts
export type Product = {
  id: string;
  establishmentId: string;
  name: string;
  description?: string;
  price: number; // em EUR
  image: string;
  category: string; // ex.: 'Sanduíches e McMenu'
  featured?: boolean; // aparece na capa do estabelecimento
};
