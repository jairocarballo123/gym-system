const PlanService = require('../services/PlanServices');

const PlanController = {
  async crear(req, res) {
    try {
      const result = await PlanService.crear(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },


 async getMiembrosPorPlan(req, res) {
  try {
    const data = await PlanService.MiembrosPorPlan();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
,
 async getProximosVencer(req, res) {
  try {
    const data = await PlanService.ProximosVencer();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
},

   async  listar(req, res) {
    try {
      const planes = await PlanService.listar();
      res.status(200).json({ success: true, data: planes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const plan = await PlanService.buscarPorId(req.params.id);
      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const result = await PlanService.actualizar(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      await PlanService.eliminar(req.params.id);
      res.status(200).json({ success: true, message: "Plan desactivado" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async obtenerResumen(req, res) {
    try {
      const resumen = await PlanService.obtenerResumen();
      res.status(200).json({ success: true, data: resumen });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async obtenerPlanMasVendido(req, res) {
    try {
      const plan = await PlanService.obtenerPlanMasVendido();
      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async ingresosPorPlan(req, res) {
    try {
      const ingresos = await PlanService.ingresosPorPlan();
      res.status(200).json({ success: true, data: ingresos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = PlanController;