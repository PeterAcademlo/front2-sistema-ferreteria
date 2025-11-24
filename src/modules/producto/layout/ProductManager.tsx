// components/ProductManager.tsx
import React from "react";
import { useProducts } from "../../../hooks/useProducts";
import type { Product, ProductFormData } from "../../../types/product";
import ModalCreateProduct from "../modal/ModalCreateProduct";
import ModalUpdateProduct from "../modal/ModalUpdateProduct";
import ModalDeleteProduct from "../modal/ModalDeleteProduct";

const ProductManager: React.FC = () => {
  const {
    products,
    loading,
    formData,
    customAlert,
    setFormData,
    handleSubmit,
    handleDelete,
    handleEdit,
    resetForm,
  } = useProducts();

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<{
    id: number;
    nombre: string;
  } | null>(null);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const openUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    resetForm();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
      closeCreateModal();
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
      closeUpdateModal();
    } catch (error) {
      console.error("Error actualizando producto:", error);
    }
  };

  const handleDeleteClick = (id: number, nombre: string) => {
    setProductToDelete({ id, nombre });
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDelete(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  const handleEditClick = (product: Product) => {
    handleEdit(product);
    openUpdateModal();
  };

  const handleFormDataChange = (newData: ProductFormData) => {
    setFormData(newData);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="inline-flex items-center justify-center mb-4 p-4 w-full bg-primary rounded-2xl relative">
          <div className="bg-primary rounded-full w-14 h-14 flex justify-center items-center border-white border-2 mr-4">
            <i className="bx bx-package text-3xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mt-1">
              TecnoMarket S.A.C
            </h1>
            <div className="w-16 h-0.5 bg-white mx-auto mt-2 rounded-full"></div>
          </div>
        </div>

        {/* Botón Crear Producto */}
        <div className="text-center mb-8">
          <button
            onClick={openCreateModal}
            className="bg-primary hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto text-lg"
          >
            <i className="bx bx-plus-circle text-2xl mr-2"></i>
            Crear Nuevo Producto
          </button>
        </div>

        {/* Lista de productos */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary flex items-center">
              <i className="bx bx-list-ul mr-3"></i>
              Lista de Productos
            </h2>

            <span className="bg-accent text-primary px-4 py-2 rounded-full font-semibold">
              {products.length} productos
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <i className="bx bx-loader-alt bx-spin text-4xl text-primary mb-4"></i>
              <p className="text-gray-600 text-xl">Cargando productos...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {/* Header de la tabla */}
              <div className="bg-linear-to-r from-primary to-green-600 text-white grid grid-cols-7 gap-2">
                <div className="p-2 py-4 text-center font-semibold text-sm">
                  Nombre
                </div>
                <div className="p-2 py-4 text-center font-semibold text-sm">
                  Descripción
                </div>
                <div className="p-2 py-4 text-center font-semibold text-sm">
                  Precio
                </div>
                <div className="p-2 py-4 text-center font-semibold text-sm">
                  Cantidad
                </div>
                <div className="p-2 py-4 text-center font-semibold text-sm">
                  Código
                </div>
                <div className="p-2 py-4 text-center font-semibold text-sm">
                  Stock Status
                </div>
                <div className="p-2 py-4 text-center font-semibold text-sm">
                  Acciones
                </div>
              </div>

              <div className="h-70 3xl:h-120 overflow-y-auto">
                {products.map((product: Product, index: number) => (
                  <div
                    key={product.id}
                    className={`grid grid-cols-7 gap-2 border-b hover:bg-green-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="p-2 py-5 text-center font-medium text-gray-800 text-sm truncate">
                      {product.nombre}
                    </div>
                    <div className="p-2 py-5 text-gray-600 text-sm text-center truncate">
                      {product.descripcion}
                    </div>
                    <div className="p-2 py-5 text-center font-bold text-green-600">
                      {formatPrice(product.precio)}
                    </div>
                    <div className="p-2 py-5 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.cantidad} unidades
                      </span>
                    </div>
                    <div className="p-2 py-5 text-center">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.codigo}
                      </span>
                    </div>
                    <div className="p-2 py-5 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.cantidad > 10
                            ? "bg-green-100 text-green-800"
                            : product.cantidad > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.cantidad > 10
                          ? "En Stock"
                          : product.cantidad > 0
                          ? "Stock Bajo"
                          : "Sin Stock"}
                      </span>
                    </div>
                    <div className="p-2 py-5">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs transition-all duration-200 transform hover:scale-105 flex items-center"
                        >
                          <i className="bx bx-edit mr-1"></i>Editar
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(product.id, product.nombre)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-all duration-200 transform hover:scale-105 flex items-center"
                        >
                          <i className="bx bx-trash mr-1"></i>Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ModalCreateProduct
        showModal={showCreateModal}
        formData={formData}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
        onFormDataChange={handleFormDataChange}
      />

      <ModalUpdateProduct
        showModal={showUpdateModal}
        formData={formData}
        onClose={closeUpdateModal}
        onSubmit={handleUpdateSubmit}
        onFormDataChange={handleFormDataChange}
      />

      <ModalDeleteProduct
        productToDelete={productToDelete}
        customAlert={customAlert}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ProductManager;