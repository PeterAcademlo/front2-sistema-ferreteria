// src/services/api.ts
import axios from "axios";

const API_BASE_URL = "https://back2-sistema-ferreteria-r66z.onrender.com";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const productService = {
  //  Obtener todos los productos (para Stock)
  getProducts: () => api.get("/productos"), //  SIN /api/

  //  Obtener producto por ID
  getProductById: (id: number) => api.get(`/productos/${id}`), //  SIN /api/

  //  Buscar productos (para Ventas)
  searchProducts: (query: string) =>
    api.get(`/productos/buscar/${encodeURIComponent(query)}`), //  SIN /api/

  //  Crear nuevo producto
  createProduct: (productData: {
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    codigo: string;
  }) => api.post("/productos", productData), //  SIN /api/

  //  Actualizar producto completo
  updateProduct: (
    id: number,
    productData: {
      nombre: string;
      descripcion: string;
      precio: number;
      cantidad: number;
      codigo: string;
    }
  ) => api.put(`/productos/${id}`, productData), //  SIN /api/

  //  Actualizar solo el stock (para después de ventas)
  updateStock: (id: number, nuevaCantidad: number) =>
    api.put(`/productos/${id}/stock`, { cantidad: nuevaCantidad }), // SIN /api/

  //  Eliminar producto
  deleteProduct: (id: number) => api.delete(`/productos/${id}`), //  SIN /api/
};

export const authService = {
  //  Verificar si el token es válido
  verifyToken: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    return !!token;
  },

  //  Obtener token guardado
  getToken: () => {
    return localStorage.getItem("token");
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  },
};

export default api;
