// services/Producto.service.js
const Producto = require('../Entidades/Producto');
const ProductoModel = require('../models/ProductoModel');

class ProductoService {
  static async crear(data, userId) {
    try {
      const producto = new Producto(data);
      producto.validar();

      const nuevo = await ProductoModel.crear(producto.toDatabase());

      if (data.stockInicial > 0) {
        await ProductoModel.crearStockInicial(nuevo.ProductId, data.stockInicial);
      }

      return nuevo;
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  static async listar() {
    try {
      return await ProductoModel.listar();
    } catch (error) {
      throw new Error(`Error al listar productos: ${error.message}`);
    }
  }

  static async buscarPorId(id) {
    try {
      const producto = await ProductoModel.buscarPorId(id);
      if (!producto) throw new Error('Producto no encontrado');
      return producto;
    } catch (error) {
      throw new Error(`Error al buscar producto: ${error.message}`);
    }
  }

  static async actualizar(id, data, userId) {
    try {
      const producto = new Producto(data);
      producto.validar();

      return await ProductoModel.actualizar(id, producto.toDatabase());
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  static async desactivar(id) {
    try {
      return await ProductoModel.desactivar(id);
    } catch (error) {
      throw new Error(`Error al desactivar producto: ${error.message}`);
    }
  }

  static async obtenerStock(productId) {
    try {
      return await ProductoModel.obtenerStock(productId);
    } catch (error) {
      throw new Error(`Error al obtener stock: ${error.message}`);
    }
  }
  static async ajustarStock(productId, cantidad, userId, motivo) {
    try {
      if (cantidad === 0) throw new Error('La cantidad debe ser diferente de cero');

      return await ProductoModel.ajustarStock(productId, cantidad, userId);
    } catch (error) {
      throw new Error(`Error al ajustar stock: ${error.message}`);
    }
  }

  static async obtenerResumen() {
    try {
      return await ProductoModel.obtenerResumen();
    } catch (error) {
      throw new Error(`Error al obtener resumen: ${error.message}`);
    }
  }


  static async obtenerDetalleCompleto(id) {
    try {
      // Buscar producto por ID
      const producto = await ProductoModel.buscarPorId(id);
      if (!producto) throw new Error('Producto no encontrado');

      // Pasar parámetros correctos
      const masVendidos = await ProductoModel.obtenerMasVendidos(5);
      const movimientos = await ProductoModel.obtenerMovimientos(id, 20);
      const stockBajo = await ProductoModel.obtenerStockBajo(5);

      return { producto, masVendidos, movimientos, stockBajo };
    } catch (error) {
      console.error("Error en obtenerDetalleCompleto:", error.message);


      throw error;


    }
  }

}

module.exports = ProductoService;