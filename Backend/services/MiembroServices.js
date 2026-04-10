// services/MiembroServices.js
const MemberModel = require('../models/miembroModels');
const Miembro = require('../Entidades/Miembro');

// Cache simple para consultas frecuentes
const NodeCache = require('node-cache');
const memberCache = new NodeCache({ stdTTL: 300 }); // 5 minutos

class MemberService {

  static _formatearRespuesta(row) {
    const miembro = new Miembro(row);
    return {
      id: miembro.id,
      fullName: miembro.fullName,
      phone: miembro.obtenerTelefonoFormateado(),
      address: miembro.address,
      statusId: miembro.statusId,
      balance: miembro.balance,
      endDate: miembro.endDate,
      tieneAcceso: miembro.tieneAcceso(),
      diasRestantes: miembro.diasRestantes(),
      trainerName: row.trainerName || null 
    };
  }

  // services/MiembroServices.js - nuevos métodos

  static async obtenerResumen() {
    return await MemberModel.obtenerResumen();
  }

  static async obtenerDetalleCompleto(id) {
    // Datos básicos
    const miembro = await this.buscarPorId(id);
    if (!miembro) throw new Error('Miembro no encontrado');

    // Historiales
    const membresias = await MemberModel.obtenerHistorialMembresias(id);
    const pagos = await MemberModel.obtenerHistorialPagos(id);
    const asistencia = await MemberModel.obtenerAsistenciaUltimosDias(id, 30);
   

    return {
      miembro,
      membresias,
      pagos,
      asistencia

    };
  }

  static async registerFullMember(data, currentUserId) {
    // Verificar que el cajero que registra es el mismo que está logueado
    if (data.cashierId !== currentUserId) {
      throw new Error("No puedes registrar un miembro en nombre de otro cajero.");
    }

    const nuevoMiembro = new Miembro(data);
    nuevoMiembro.validarParaRegistroCompleto();

    if (nuevoMiembro.phone) {
      const existe = await MemberModel.findByPhone(nuevoMiembro.phone);
      if (existe) throw new Error("Ya existe un miembro registrado con ese número de teléfono.");
    }

    // Invalidar caché después de crear
    memberCache.del('all_members');

    // Log de auditoría
    await this._logAuditoria('CREATE_MEMBER', data, currentUserId);

    return await MemberModel.registerFullMember(data, currentUserId);
  }

  static async listarTodos() {
    const cacheKey = 'all_members';
    let cached = memberCache.get(cacheKey);

    if (cached) return cached;

    const datosCrudos = await MemberModel.listarTodos();
    const result = datosCrudos.map(row => this._formatearRespuesta(row));

    memberCache.set(cacheKey, result);
    return result;
  }

  static async buscarPorId(id) {
    const row = await MemberModel.buscarPorId(id);
    if (!row) throw new Error("Miembro no encontrado");
    return this._formatearRespuesta(row);
  }

  static async actualizar(id, data, currentUserId) {
    const validador = new Miembro(data);
    validador.validarDatosCore();

    // Invalidar caché
    memberCache.del('all_members');

    // Log de auditoría
    await this._logAuditoria('UPDATE_MEMBER', { id, ...data }, currentUserId);

    return await MemberModel.actualizar(id, data);
  }

  static async eliminar(id, currentUserId) {
    const miembroActual = await this.buscarPorId(id);

    if (miembroActual.balance > 0) {
      throw new Error(`No se puede desactivar a ${miembroActual.fullName} porque tiene una deuda pendiente de $${miembroActual.balance}.`);
    }

    // Invalidar caché
    memberCache.del('all_members');

    // Log de auditoría
    await this._logAuditoria('DELETE_MEMBER', { id, fullName: miembroActual.fullName }, currentUserId);

    return await MemberModel.eliminar(id);
  }

  static async _logAuditoria(accion, data, userId) {
    // En producción, esto podría ir a una tabla de logs o a Winston
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action: accion,
      data: JSON.stringify(data)
    };
    console.log('[AUDIT]', JSON.stringify(logEntry));
  }

  static invalidarCache() {
    memberCache.del('all_members');
  }


  // services/MiembroServices.js (añadir al final de la clase)

  static async obtenerResumen() {
    const total = await MemberModel.contarTodos();
    const activos = await MemberModel.contarActivos();
    const proximosAVencer = await MemberModel.contarProximosAVencer(7);
    const deudores = await MemberModel.contarDeudores();
    return { total, activos, proximosAVencer, deudores };
  }

  static async obtenerDetalleCompleto(id) {
   
    const miembro = await MemberModel.buscarPorId(id);
    if (!miembro) throw new Error('Miembro no encontrado');

    const membresias = await MemberModel.obtenerMembresias(id);
    const pagos = await MemberModel.obtenerPagos(id);
    const asistencia = await MemberModel.obtenerAsistenciaUltimosDias(id, 30);

    return { miembro, membresias, pagos, asistencia };
  }
}

module.exports = MemberService;