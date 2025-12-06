class Payment {
    constructor({ id, recibo_id, miembro_id, monto, fecha_pago }) {
        this.id = id;
        this.recibo_id = recibo_id; 
        this.miembro_id = miembro_id;
        this.monto = parseFloat(monto);
        this.fecha_pago = fecha_pago;

        this.validate();
    }

    validate() {
        if (!this.recibo_id) {
            throw new Error("Error interno: No se generó el ID del recibo.");
        }
        if (!this.miembro_id) {
            throw new Error("El pago debe estar asociado a un socio.");
        }
        if (isNaN(this.monto) || this.monto <= 0) {
            throw new Error("El monto debe ser mayor a 0.");
        }
        if (!this.fecha_pago) {
            throw new Error("La fecha de pago es obligatoria.");
        }
    }
}

module.exports = Payment;