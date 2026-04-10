// entities/Producto.entity.js
class Producto {
  constructor(data) {
    this.id = data.id || null;
    this.nombre = data.nombre ? data.nombre.trim() : null;
    this.precio = data.precio || 0;
    this.statusId = data.statusId ?? 1;
    this.stockInicial = data.stockInicial || 0;
  }

  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.length < 3) {
      errores.push('El nombre del producto debe tener al menos 3 caracteres.');
    }

    if (this.precio <= 0) {
      errores.push('El precio debe ser mayor a cero.');
    }

    if (errores.length > 0) {
      throw new Error(errores.join(' | '));
    }
    return true;
  }

  toDatabase() {
    return {
      ProductName: this.nombre,
      Price: this.precio,
      StatusId: this.statusId
    };
  }
}

module.exports = Producto;