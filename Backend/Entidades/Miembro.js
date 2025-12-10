class Miembro {
  constructor(nombre, direccion, telefono, plan_id = null, entrenadorId = null) {
    this.id = this.generarIdUnico();
    this.nombre = nombre;
    this.direccion = direccion;
    this.telefono = telefono;
    this.fecha_registro = new Date();
    this.plan_id = plan_id;
    this.fechaVencimiento = null;
    this.estadoMembresia = 'inactivo'; // por defecto inactivo hasta asignar plan
    this.entrenadorId = entrenadorId;
  }

  generarIdUnico() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
      id += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return id;
  }

  validarTelefono() {
    return /^[0-9]{8,15}$/.test(this.telefono);
  }

  asignarPlan(plan) {
    this.plan_id = plan.id;
    this.estadoMembresia = 'activo';

    const fechaRegistro = new Date();
    const vencimiento = new Date(fechaRegistro);
    vencimiento.setDate(fechaRegistro.getDate() + plan.duracion_dias);
    this.fechaVencimiento = vencimiento;
  }

  verificarEstadoMembresia() {
    if (this.fechaVencimiento) {
      const hoy = new Date();
      if (hoy > this.fechaVencimiento) {
        this.estadoMembresia = 'inactivo';
      }
    }
    return this.estadoMembresia;
  }
}

module.exports = Miembro;
