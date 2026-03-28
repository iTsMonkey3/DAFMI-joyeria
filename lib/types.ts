// lib/types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string; // <-- ¡Actualizado al formato de la base de datos!
}