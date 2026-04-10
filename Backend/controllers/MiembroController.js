// controllers/MiembroController.js
const MemberService = require('../services/MiembroServices');

const MemberController = {

  async registerFullMember(req, res) {
    try {
      const result = await MemberService.registerFullMember(req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: "Miembro registrado con éxito",
        data: result
      });
    } catch (error) {
      if (error.message.includes('teléfono')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      if (error.message.includes('cajero')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },


   async obtenerResumen(req, res) {
    try {
      const resumen = await MemberService.obtenerResumen();
      res.json({ success: true, data: resumen });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

   async obtenerDetalle(req, res) {
    try {
      const detalle = await MemberService.obtenerDetalleCompleto(req.params.id);
      res.json({ success: true, data: detalle });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async listarTodos(req, res) {
    try {
      const miembros = await MemberService.listarTodos();
      res.status(200).json({ success: true, data: miembros });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const miembro = await MemberService.buscarPorId(req.params.id);
      res.status(200).json({ success: true, data: miembro });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const actualizado = await MemberService.actualizar(req.params.id, req.body, req.user.id);
      res.status(200).json({
        success: true,
        message: "Datos actualizados correctamente",
        data: actualizado
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await MemberService.eliminar(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: "Miembro desactivado correctamente" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

 async obtenerResumen(req, res) {
  try {
    const resumen = await MemberService.obtenerResumen();
    res.json({ success: true, data: resumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
},

async obtenerDetalleCompleto(req, res) {
  try {
    const detalle = await MemberService.obtenerDetalleCompleto(req.params.id);
    res.json({ success: true, data: detalle });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}
}


module.exports = MemberController;