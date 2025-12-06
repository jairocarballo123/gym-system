class Producto {
  constructor(nombre, descripcion, categoria_id, tipo, stock, precio_unitario) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.categoria_id = categoria_id;
    this.tipo = tipo;
    this.stock = parseInt(stock);
    this.precio_unitario = parseFloat(precio_unitario);
    this.fecha_registro = new Date();
  }

  validarTipo() {
    return ['activo', 'venta'].includes(this.tipo);
  }

  validarStock() {
    return this.stock >= 0;
  }

  calcularTotal(cantidad) {
    return this.precio_unitario * cantidad;
  }
}

module.exports = Producto;
