class Plan {
    constructor(nombre, precio, duracion_dias, descripcion) {
        this.id = this.generarId();
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.duracion_dias = parseInt(duracion_dias);
        this.descripcion = descripcion;
        this.activo = 'activo';
    }
generarId() {
  
    if (!this.constructor.contador) {
        this.constructor.contador = 1000;
    }
    
    const prefijo = this.nombre ? this.nombre.substring(0, 3).toUpperCase() : 'PLN';
    const id = `${prefijo}-${this.constructor.contador++}`;
    
  
    return id;
}

    validarDatos() {
        if (!this.nombre) throw new Error('El plan debe tener nombre');
        if (this.precio < 0) throw new Error('El precio no puede ser negativo');
        if (this.duracion_dias < 1) throw new Error('La duración debe ser al menos 1 día');
    }
}
module.exports = Plan;