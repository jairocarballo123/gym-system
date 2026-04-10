// entities/Empleado.js
class Empleado {
  constructor(data) {
    this.id = data.id || null;
    this.nombre = data.nombre || data.fullName;
    this.telefono = data.telefono || data.phone;
    this.roleId = data.roleId;
    this.specialty = data.specialty || null;
    this.availability = data.availability || null;
    this.statusId = data.statusId ?? 1;
    this.password = data.password || null;
  }

  validarDatos() {
    const errores = [];
    if (!this.nombre || this.nombre.length < 3) {
      errores.push('El nombre debe tener al menos 3 caracteres');
    }
    // Solo exigir especialidad si es entrenador (roleId = 2)
    if (this.roleId === 2 && !this.specialty) {
      errores.push('La especialidad es obligatoria para entrenadores');
    }
    if (errores.length) throw new Error(errores.join(' | '));
    return true;
  }

  toDatabase() {
    return {
      FullName: this.nombre,
      Phone: this.telefono,
      RoleId: this.roleId,
      StatusId: this.statusId,
      Specialty: this.specialty,
      Availability: this.availability,
      PasswordHash: this.password
    };
  }
}

module.exports = Empleado;