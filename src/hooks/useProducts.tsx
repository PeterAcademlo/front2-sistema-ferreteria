// hooks/useProducts.ts
import React from "react";
import type { Product, ProductFormData } from "../types/product";
import { productService } from "../api/Api";

export const useProducts = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    codigo: ""
  });
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [customAlert, setCustomAlert] = React.useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error cargando productos:", error);
      showAlert("Error al cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      cantidad: "",
      codigo: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.codigo) {
      showAlert("Nombre y código son obligatorios", "error");
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      showAlert("El precio debe ser mayor a 0", "error");
      return;
    }

    if (!formData.cantidad || parseInt(formData.cantidad) < 0) {
      showAlert("La cantidad no puede ser negativa", "error");
      return;
    }

    try {
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad),
        codigo: formData.codigo
      };

      if (editingId) {
        await productService.updateProduct(editingId, productData);
        showAlert("Producto actualizado exitosamente", "success");
      } else {
        await productService.createProduct(productData);
        showAlert("Producto creado exitosamente", "success");
      }
      
      await loadProducts();
      resetForm();
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error guardando producto:", error);
      const errorMessage = error.response?.data?.error || "Error al guardar el producto";
      showAlert(errorMessage, "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      showAlert("Producto eliminado exitosamente", "success");

      await loadProducts();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error eliminando producto:", error);
      const errorMessage = error.response?.data?.error || "Error al eliminar el producto";
      showAlert(errorMessage, "error");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      cantidad: product.cantidad.toString(),
      codigo: product.codigo
    });
    setEditingId(product.id);
  };

  const showAlert = (message: string, type: "success" | "error") => {
    setCustomAlert({ show: true, message, type });
    setTimeout(() => {
      setCustomAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return {
    products,
    loading,
    formData,
    customAlert,
    editingId,
    setFormData,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
    showAlert,
    loadProducts 
  };
};