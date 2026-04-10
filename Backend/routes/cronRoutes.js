// routes/CronRoutes.js
const express = require('express');
const router = express.Router();
const CronController = require('../controllers/cronController');
const { authorize } = require('../middlewares/role.middleware');

// Solo administradores pueden ejecutar esta tarea manualmente
router.post('/vencer-membresias', authorize(1), CronController.ejecutarVencimiento);

module.exports = router;