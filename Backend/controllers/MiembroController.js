const MiembroService = require('../services/MiembroServices');

async function registrarMiembro(req, res) {
  try {
    const miembro = await MiembroService.registrar(req.body);
    res.status(201).json({ 
      mensaje: 'Miembro registrado exitosamente', 
      data: miembro 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function AsignarEntrenador(req, res) {
  try {
    const resultado = await MiembroService.asignarEntrenador(
      req.params.id, 
      req.body.entrenador_id
    );
    
    res.status(200).json({
      success: true,
      data: resultado
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function quitarEntrenador(req, res) {
  try {
    const resultado = await MiembroService.quitarEntrenador(req.params.id);
    
    res.status(200).json({
      success: true,
      data: resultado
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function listarMiembros(req, res) {
  try {
    const miembros = await MiembroService.listar();
    res.status(200).json(miembros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function buscarMiembro(req, res) {
  try {
    const miembro = await MiembroService.buscarPorId(req.params.id);
    res.status(200).json(miembro);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}


async function actualizarMiembro(req, res) {
  try {
    const miembro = await MiembroService.actualizar(req.params.id, req.body);
    res.status(200).json({ 
      mensaje: 'Miembro actualizado exitosamente', 
      data: miembro 
    });
  } catch (err) {
    const statusCode = err.message.includes('no encontrado') ? 404 : 400;
    res.status(statusCode).json({ error: err.message });
  }
}


async function renovarMembresia(req, res) {
  try {
    const { id } = req.params;
    const { plan_id } = req.body;

    if (!plan_id) {
      return res.status(400).json({ error: 'plan_id es obligatorio' });
    }

    const miembro = await MiembroService.renovarMembresia(id, plan_id);

    res.json({
      mensaje: 'Membresía renovada con éxito',
      data: miembro
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function eliminarMiembro(req, res) {
  try {
    const resultado = await MiembroService.eliminar(req.params.id);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.message.includes('no encontrado') ? 404 : 400;
    res.status(statusCode).json({ error: err.message });
  }
}

module.exports = {
  registrarMiembro,
  listarMiembros,
  buscarMiembro,
  actualizarMiembro,
  renovarMembresia,
  eliminarMiembro,
  AsignarEntrenador,
  quitarEntrenador
};