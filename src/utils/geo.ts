// src/utils/geo.ts
import type { Coords } from "../types/establishment";

export function haversineKm(a: Coords, b: Coords) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDlat = Math.sin(dLat / 2);
  const sinDlon = Math.sin(dLon / 2);
  const c =
    sinDlat * sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon * sinDlon;
  const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  return R * d;
}

export function formatCount(n: number) {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k+`;
  return `${n}`;
}

export function formatPriceEUR(value: number) {
  // Formato simples PT: MTNX,YY
  return `${value.toFixed(2).replace(".", ",")} MTN`;
}
