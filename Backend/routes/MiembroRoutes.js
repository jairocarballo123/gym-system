const express = require('express');
const router = express.Router();

const {
  registrarMiembro,
  listarMiembros,
  buscarMiembro,
  actualizarMiembro,
  eliminarMiembro,
  renovarMembresia,
  AsignarEntrenador,
  quitarEntrenador
} = require('../controllers/MiembroController');

router.put('/:id/entrenador', AsignarEntrenador);  

router.delete('/:id/entrenador', quitarEntrenador)

router.put('/:id/renovar', renovarMembresia);

router.post('/', registrarMiembro);

router.get('/', listarMiembros);

router.get('/:id', buscarMiembro);

router.put('/:id', actualizarMiembro);

router.delete('/:id', eliminarMiembro);

module.exports = router;