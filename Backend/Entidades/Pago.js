class Pago {
  constructor(data) {
    this.memberId = data.memberId || null;
    this.currencyId = data.currencyId || 1;
    this.paymentMethodId = data.paymentMethodId || null;
    this.referenceNumber = data.referenceNumber || null;
    this.amountPaid = data.amountPaid || 0;
    this.cashierId = data.cashierId || null;
    this.exchangeRate = data.exchangeRate || 1.0;
    this.notes = data.notes || null;
    this.details = data.details || [];
  }

  validar() {
    const errores = [];
    const totalCalculado = this.details.reduce((sum, d) => sum + d.subTotal, 0);

    if (!this.details || this.details.length === 0) {
      errores.push('La factura debe tener al menos un detalle.');
    }

    // 🔥 CAMBIO: Ahora permite pagos parciales (solo valida que sea mayor a cero)
    if (this.amountPaid <= 0) {
      errores.push(`El monto pagado (${this.amountPaid}) debe ser mayor a cero.`);
    }

    if (this.details.some(d => d.itemType === 'PLAN') && !this.memberId) {
      errores.push('Para registrar un plan, debe especificar el miembro.');
    }

    if (!this.paymentMethodId) {
      errores.push('Debe seleccionar un método de pago.');
    }

    if (!this.cashierId) {
      errores.push('Falta identificación del cajero.');
    }

    if (errores.length > 0) {
      throw new Error(errores.join(' | '));
    }
    return true;
  }

  toJSON() {
    return {
      factura: {
        MemberId: this.memberId,
        CurrencyId: this.currencyId,
        PaymentMethodId: this.paymentMethodId,
        ReferenceNumber: this.referenceNumber,
        AmountPaid: this.amountPaid,
        CashierId: this.cashierId,
        ExchangeRate: this.exchangeRate,
        Notes: this.notes
      },
      detalles: this.details.map(d => ({
        ItemType: d.itemType,
        ItemId: d.itemId,
        Quantity: d.quantity,
        UnitPrice: d.unitPrice,
        SubTotal: d.subTotal
      }))
    };
  }
}

module.exports = Pago;