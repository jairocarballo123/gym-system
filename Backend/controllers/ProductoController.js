// controllers/Producto.controller.js
const ProductoService = require('../services/ProductoServices');

const ProductoController = {
  async crear(req, res) {
    try {
      const result = await ProductoService.crear(req.body, req.user.id);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async listar(req, res) {
    try {
      const productos = await ProductoService.listar();
      res.status(200).json({ success: true, data: productos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const producto = await ProductoService.buscarPorId(req.params.id);
      res.status(200).json({ success: true, data: producto });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const actualizado = await ProductoService.actualizar(req.params.id, req.body, req.user.id);
      res.status(200).json({ success: true, data: actualizado });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async desactivar(req, res) {
    try {
      await ProductoService.desactivar(req.params.id);
      res.status(200).json({ success: true, message: 'Producto desactivado' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async obtenerStock(req, res) {
    try {
      const stock = await ProductoService.obtenerStock(req.params.id);
      res.status(200).json({ success: true, data: { productId: req.params.id, stock } });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async ajustarStock(req, res) {
    try {
      const { cantidad, motivo } = req.body;
      await ProductoService.ajustarStock(req.params.id, cantidad, req.user.id, motivo);
      res.status(200).json({ success: true, message: 'Stock ajustado correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
,

 async obtenerResumen(req, res) {
  try {
    const resumen = await ProductoService.obtenerResumen();
    res.json({ success: true, data: resumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
},

async obtenerDetalleCompleto(req, res) {
  try {
    const detalleProducto = await ProductoService.obtenerDetalleCompleto(req.params.id);
    res.json({ success: true, data: detalleProducto });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}

};

module.exports = ProductoController;