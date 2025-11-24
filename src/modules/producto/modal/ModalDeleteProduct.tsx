// components/modals/ModalDeleteProduct.tsx
import React from "react";

interface ModalDeleteProductProps {
  productToDelete: { id: number; nombre: string } | null;
  customAlert: { show: boolean; message: string; type: string };
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalDeleteProduct: React.FC<ModalDeleteProductProps> = ({
  productToDelete,
  customAlert,
  onConfirm,
  onCancel,
}) => {
  if (!productToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="bg-red-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-red-400 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <i className="bx bx-trash text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Eliminar Producto</h2>
                <p className="text-red-100">Confirmar eliminación</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bx bx-error text-3xl text-red-500"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¿Está seguro de eliminar este producto?
            </h3>
            <p className="text-gray-600">
              El producto <span className="font-bold text-red-500">"{productToDelete.nombre}"</span> será eliminado permanentemente.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Alert */}
          {customAlert.show && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                customAlert.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <i
                  className={`bx ${
                    customAlert.type === "success"
                      ? "bx-check-circle text-green-500"
                      : "bx-error text-red-500"
                  } mr-2`}
                ></i>
                {customAlert.message}
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <i className="bx bx-trash mr-2"></i>
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteProduct;