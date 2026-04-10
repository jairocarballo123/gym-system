class Plan {
   
    constructor(nombre, precio, duracion_dias, descripcion, isAddOn = 0, id = null) {
        this.nombre = nombre;
        this.precio = precio;
        this.duracion_dias = duracion_dias;
        this.descripcion = descripcion;
        this.isAddOn = isAddOn;
        this.id = id; 
    }

    validarDatos() {
        if (!this.nombre) throw new Error("El nombre es obligatorio");
        if (this.precio < 0) throw new Error("El precio no puede ser negativo");
        if (this.duracion_dias < 0) throw new Error("La duración no puede ser negativa");
    }
    
    esServicioExtra() {
        return this.isAddOn === 1;
    }
}

module.exports = Plan;