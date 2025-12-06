const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/pagoController');

router.get('/', PaymentController.getAll);
router.post('/', PaymentController.create); // ¡Ya no requiere enviar recibo_id!
router.delete('/:id', PaymentController.delete);

module.exports = router;