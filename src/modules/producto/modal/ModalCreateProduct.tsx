// components/modals/ModalCreateProduct.tsx
import React from "react";
import type { ProductFormData } from "../../../types/product";

interface ModalCreateProductProps {
  showModal: boolean;
  formData: ProductFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: ProductFormData) => void;
}

const ModalCreateProduct: React.FC<ModalCreateProductProps> = ({
  showModal,
  formData,
  onClose,
  onSubmit,
  onFormDataChange,
}) => {
  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <i className="bx bx-plus-circle text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Crear Nuevo Producto</h2>
                <p className="text-blue-100">Complete los datos del producto</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <i className="bx bx-x text-3xl"></i>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Nombre */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Ingrese el nombre del producto"
                required
              />
            </div>

            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código SKU *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => handleInputChange("codigo", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Ej: PROD-001"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => handleInputChange("precio", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="0.00"
                min="0"
                required
              />
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad en Stock *
              </label>
              <input
                type="number"
                value={formData.cantidad}
                onChange={(e) => handleInputChange("cantidad", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="0"
                min="0"
                required
              />
            </div>

            {/* Descripción */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Ingrese una descripción del producto..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white hover:bg-primary/90 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <i className="bx bx-plus-circle mr-2"></i>
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateProduct;