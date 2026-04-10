
class Asistencia {
  constructor(data = {}) {
    this.id = data.id || null;
    this.memberId = data.memberId || null;
    this.memberName = data.memberName || null;
    this.accessDate = data.accessDate || new Date();
    this.accessGranted = data.accessGranted ?? 1;
    this.registeredBy = data.registeredBy || null;
  }

  validar() {
    const errores = [];
    if (!this.memberId) {
      errores.push('El ID del miembro es obligatorio');
    }
    if (this.accessGranted !== 0 && this.accessGranted !== 1) {
      errores.push('AccessGranted debe ser 0 o 1');
    }
    if (errores.length > 0) {
      throw new Error(errores.join(' | '));
    }
    return true;
  }

  toDatabase() {
    return {
      MemberId: this.memberId,
      AccessDate: this.accessDate,
      AccessGranted: this.accessGranted,
      RegisteredBy: this.registeredBy
    };
  }
}

module.exports = Asistencia;