import React, { useState } from 'react';
import { productService } from '../../../api/Api';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  codigo: string;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

const SalesManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [processingSale, setProcessingSale] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setProductos([]);
      setHasSearched(false);
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await productService.getProducts();
      const todosLosProductos = response.data;
      
      const productosFiltrados = todosLosProductos.filter((producto: Producto) =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setProductos(productosFiltrados);
      
      if (productosFiltrados.length === 0) {
        alert('No se encontraron productos con ese nombre');
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setProductos([]);
      alert('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = (producto: Producto) => {
    const existeEnCarrito = carrito.find(item => item.producto.id === producto.id);
    
    if (existeEnCarrito) {
      setCarrito(prev => 
        prev.map(item => 
          item.producto.id === producto.id 
            ? { 
                ...item, 
                cantidad: item.cantidad + 1,
                subtotal: (item.cantidad + 1) * item.producto.precio
              }
            : item
        )
      );
    } else {
      const nuevoItem: ItemCarrito = {
        producto,
        cantidad: 1,
        subtotal: producto.precio
      };
      setCarrito(prev => [...prev, nuevoItem]);
    }
    
    setSearchQuery('');
    setProductos([]);
    setHasSearched(false);
  };

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito(prev =>
      prev.map(item =>
        item.producto.id === id
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * item.producto.precio
            }
          : item
      )
    );
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== id));
  };

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  };

  const calcularTotalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setProcessingSale(true);

    try {
      for (const item of carrito) {
        const nuevoStock = item.producto.cantidad - item.cantidad;
        
        await productService.updateProduct(item.producto.id, {
          ...item.producto,
          cantidad: nuevoStock
        });
      }

      const resumen = carrito.map(item => 
        `${item.cantidad} x ${item.producto.nombre} - S/${item.subtotal}`
      ).join('\n');

      alert(`VENTA REALIZADA\n\n${resumen}\n\nTOTAL: S/${calcularSubtotal()}`);

      setCarrito([]);
      
    } catch (error) {
      console.error('Error al procesar venta:', error);
      alert('Error al procesar la venta');
    } finally {
      setProcessingSale(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-primary text-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Punto de Ventas</h1>
          <p className="text-primary-light">Sistema de ventas - TecnoMarket S.A.C</p>
        </div>
      </div>

      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-primary">
            Buscar Productos
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nombre del producto (ej: martillo)..."
              className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-green-500 disabled:bg-accent/50 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Presiona "Buscar" para encontrar productos por nombre
          </p>
        </div>

        {hasSearched && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-primary">
              {loading ? 'Buscando...' : `Resultados (${productos.length})`}
            </h3>
            
            {!loading && productos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron productos con "{searchQuery}"</p>
                <p className="text-sm">Intenta con otro nombre</p>
              </div>
            ) : (
              <div className="grid gap-3 max-h-80 overflow-y-auto">
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl hover:border-primary hover:bg-primary/5 cursor-pointer transition-all duration-200 group"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-primary">{producto.nombre}</h4>
                      <p className="text-sm text-gray-600 mt-1">{producto.descripcion}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">Código: {producto.codigo}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Stock: {producto.cantidad}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatPrice(producto.precio)}</p>
                      <button className="text-primary text-sm mt-1 flex items-center gap-1 group-hover:scale-110 transition-transform">
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center text-primary">
              Carrito de Compras
            </h2>
            <span className="bg-green-600 opacity-80 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
              {calcularTotalItems()} items
            </span>
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {carrito.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg font-semibold">El carrito está vacío</p>
                <p className="text-sm">Busca productos para agregarlos al carrito</p>
              </div>
            ) : (
              carrito.map((item) => (
                <div key={item.producto.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-primary/30 transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg">{item.producto.nombre}</h4>
                      <p className="text-gray-600 mt-1">{item.producto.descripcion}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Código: {item.producto.codigo}</span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Stock: {item.producto.cantidad}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarDelCarrito(item.producto.id)}
                      className="text-red-500 hover:text-red-700 ml-4 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-semibold text-gray-700">Cantidad:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          className="w-10 h-10 bg-primary opacity-80 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-primary">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.producto.cantidad}
                          className="w-10 h-10 bg-primary opacity-80 rounded-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Precio unitario: {formatPrice(item.producto.precio)}</p>
                      <p className="text-xl font-bold text-primary">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {carrito.length > 0 && (
            <div className="border-t border-pprimary pt-6">
              <div className="flex justify-between items-center mb-6 p-4 border-primary border rounded-xl">
                <span className="text-xl text-primary">Total a Pagar:</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(calcularSubtotal())}</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={procesarVenta}
                  disabled={processingSale}
                  className="flex-1 bg-primary text-white py-4 rounded-xl hover:bg-green-500 font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {processingSale ? 'PROCESANDO...' : 'PROCESAR VENTA'}
                </button>
                
                <button
                  onClick={() => setCarrito([])}
                  disabled={processingSale}
                  className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesManager;