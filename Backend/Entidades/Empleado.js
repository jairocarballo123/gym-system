// Entidades/Empleado.js
class Empleado {
  constructor(nombre, rol, telefono , especialidad , disponibilidad , activo ,password) {
    this.id = this.generarIdUnico(); 
    this.nombre = nombre;
    this.telefono = telefono;
    this.rol = rol;
    this.especialidad = especialidad;
    this.disponibilidad = disponibilidad;
    this.fecha_ingreso = new Date().toISOString().split('T')[0];  
    this.activo = activo;
    this.password = password;  
     
  }

  generarIdUnico() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'EMP';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      id += caracteres[randomIndex];
    }
    return id;
  }

  validarDatos() {
    const errores = [];

    // Validar nombre
    if (!this.nombre || this.nombre.trim().length < 2) {
      errores.push('Nombre debe tener al menos 2 caracteres');
    }

    // Validar rol 
    const rolesPermitidos = ['entrenador', 'recepcionista', 'admin', 'nutriologo' ,'fisioterapeuta'];
    if (!rolesPermitidos.includes(this.rol)) {
      errores.push(`Rol debe ser uno de: ${rolesPermitidos.join(',')}`);
    }

    // Validar teléfono
    if (this.telefono && this.telefono.length < 8) {
      errores.push('Teléfono debe tener al menos 8 dígitos');
    }

    // Validar disponibilidad
    const disponibilidadesPermitidas = ['disponible', 'ocupado', 'vacaciones', 'enfermedad'];
    if (!disponibilidadesPermitidas.includes(this.disponibilidad)) {
      errores.push('Disponibilidad no válida');
    }

    // Validar activo (NUEVA VALIDACIÓN)
    const estadosPermitidos = ['activo', 'inactivo'];
    if (!estadosPermitidos.includes(this.activo)) {
      errores.push('Estado activo debe ser: activo o inactivo');
    }

    // Validar especialidad según el rol
    if (this.rol === 'entrenador' && !this.especialidad) {
      errores.push('Los entrenadores deben tener una especialidad');
    }

      if (this.rol === 'admin' && !this.password) {
      errores.push('contraseña para los admin es obligatoria');
    }



    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }

    return true;
  }

  
  desactivar() {
    this.activo = 'inactivo';
    this.disponibilidad = 'ocupado';
  }

  activar() {
    this.activo = 'activo';
    this.disponibilidad = 'disponible';
  }
}

module.exports = Empleado;