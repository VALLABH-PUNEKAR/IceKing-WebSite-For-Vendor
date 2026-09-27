import type{ Product } from "./Products";
export interface SpringPageResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number; // Current page index (0-based)
  first: boolean;
  last: boolean;
}