// types/product.ts
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  codigo: string;
}

export interface ProductFormData {
  nombre: string;
  descripcion: string;
  precio: string;
  cantidad: string;
  codigo: string;
}