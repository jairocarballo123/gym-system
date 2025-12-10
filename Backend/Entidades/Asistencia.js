
class Asistencia {
  constructor(miembroId) {
    try {
      if (!miembroId) {
        throw new Error('El ID del miembro es requerido');
      }
      
      this.miembro_id = miembroId;
      this.fecha_entrada = new Date().toISOString();
      
      // Validación inmediata al crear la entidad
      this.validarDatos();
      
    } catch (error) {
      throw new Error(`Error creando entidad Asistencia: ${error.message}`);
    }
  }

  validarDatos() {
    try {
      const errores = [];

      // Validar miembro_id
      if (typeof this.miembro_id !== 'string') {
        errores.push('Formato de ID invalido');
      } else if (this.miembro_id.length !== 6) {
        errores.push('El ID del miembro debe tener 6 caracteres');
      }

      // Validar fecha_entrada
      const fecha = new Date(this.fecha_entrada);
      if (isNaN(fecha.getTime())) {
        errores.push('La fecha de entrada no es válida');
      } else if (fecha > new Date()) {
        errores.push('La fecha de entrada no puede ser futura');
      }

      if (errores.length > 0) {
        throw new Error(errores.join(', '));
      }

      return true;
      
    } catch (error) {
      throw new Error(`Validación fallida: ${error.message}`);
    }
  }
}

module.exports = Asistencia;


