// entities/Miembro.js
class Miembro {
  constructor(data) {
    this.id = data.id || null;
    this.fullName = data.fullName ? data.fullName.trim() : null;
    this.phone = data.phone ? data.phone.replace(/[\s-]/g, '') : null;
    this.address = data.address ? data.address.trim() : null;
    this.trainerId = data.trainerId || null;
    this.statusId = data.statusId ?? 1;
    this.planId = data.planId || null;
    this.paymentMethodId = data.paymentMethodId || null;
    this.cashierId = data.cashierId || null;
    this.currencyId = data.currencyId || 1;
    this.endDate = data.endDate || null;
    this.balance = data.balance || 0;
  }

  obtenerTelefonoFormateado() {
    if (this.phone && this.phone.length === 8) {
      return `${this.phone.substring(0, 4)}-${this.phone.substring(4)}`;
    }
    return this.phone;
  }

  validarDatosCore() {
    const errores = [];
    if (!this.fullName || this.fullName.length < 3 || this.fullName.length > 100) {
      errores.push('El nombre completo es obligatorio y debe tener entre 3 y 100 caracteres.');
    }
    if (this.phone) {
      const phoneRegex = /^[0-9]{8,15}$/;
      if (!phoneRegex.test(this.phone)) {
        errores.push('El teléfono debe contener entre 8 y 15 dígitos numéricos válidos.');
      }
    }
    if (this.address && this.address.length > 255) {
      errores.push('La dirección no puede exceder los 255 caracteres permitidos.');
    }
    if (errores.length > 0) throw new Error(errores.join(' | '));
    return true;
  }

  validarParaRegistroCompleto() {
    this.validarDatosCore();
    const errores = [];
    if (!this.planId || isNaN(this.planId)) errores.push('Se requiere seleccionar un Plan válido.');
    if (!this.paymentMethodId || isNaN(this.paymentMethodId)) errores.push('Se requiere seleccionar un Método de Pago.');
    if (!this.cashierId || isNaN(this.cashierId)) errores.push('Falta la identificación del cajero (cashierId).');
    if (errores.length > 0) throw new Error(errores.join(' | '));
    return true;
  }

 tieneAcceso() {
  const hoy = new Date();
  const vencimiento = new Date(this.endDate);
  const estaActivo = this.statusId === 1;
  const noEstaVencido = vencimiento >= hoy;


  return (estaActivo && noEstaVencido);
}
  diasRestantes() {
    if (!this.endDate) return 0;
    const hoy = new Date();
    const vencimiento = new Date(this.endDate);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.max(0, Math.ceil(diferencia / (1000 * 60 * 60 * 24)));
  }
}

module.exports = Miembro;