const Miembro = require('../Entidades/Miembro');
const EmpleadoModel = require('../models/EmpleadoModel');
const MiembroModel = require('../models/miembroModels');
const PlanModel = require('../models/PlanModel')

class MiembroService {

    // 📌 REGISTRAR MIEMBRO
    async registrar(data) {
        try {
            if (!data.nombre?.trim() || !data.telefono?.trim()) {
                throw new Error('Nombre y teléfono son obligatorios');
            }

            const telefonoExiste = await MiembroModel.telefonoExiste(data.telefono);
            if (telefonoExiste) {
                throw new Error('El teléfono ya está registrado con otro miembro');
            }

            const miembro = new Miembro(
                data.nombre.trim(),
                data.direccion?.trim(),
                data.telefono.trim(),
                data.plan_id || null,
                data.entrenadorId || null
            );

            if (!miembro.validarTelefono()) {
                throw new Error('Teléfono inválido. Debe tener entre 8-15 dígitos.');
            }


            if (data.plan_id) {
                const plan = await PlanModel.buscarPorId(data.plan_id);
                if (!plan) throw new Error('El plan seleccionado no existe');
                miembro.asignarPlan(plan);
            }

            const miembroCreado = await MiembroModel.crear(miembro);
            return miembroCreado;

        } catch (error) {
            if (error.code === '23505') {
                throw new Error('ID duplicado, intenta registrar nuevamente');
            }
            throw error;
        }
    }


   async asignarEntrenador(miembroId, entrenadorId) {
  try {
    
    const miembro = await MiembroModel.buscarPorId(miembroId);
    if (!miembro) throw new Error('Miembro no encontrado');

 
    const entrenador = await EmpleadoModel.buscarPorId(entrenadorId);
    if (!entrenador) throw new Error('Entrenador no encontrado');
    if (entrenador.rol !== 'entrenador') {
      throw new Error('Solo se pueden asignar empleados con rol de entrenador');
    }

    // 3. Actualizar el miembro con el entrenador
    const miembroActualizado = await MiembroModel.actualizarEntrenador(miembroId, entrenadorId);

    return {
      mensaje: `Entrenador ${entrenador.nombre} asignado exitosamente a ${miembro.nombre}`,
      miembro: miembroActualizado,
      entrenador: entrenador
    };

  } catch (error) {
    throw new Error(`Error asignando entrenador: ${error.message}`);
  }
}




    async quitarEntrenador(miembroId) {
        try {
            //  Verificar que el miembro existe
            const miembro = await this.buscarPorId(miembroId);

            // Verificar que tiene entrenador asignado
            if (!miembro.entrenador_id) {
                throw new Error('El miembro no tiene entrenador asignado');
            }
        
            const miembroActualizado = await MiembroModel.actualizarEntrenador(miembroId, null);

            return {
                mensaje: `Entrenador removido exitosamente de ${miembro.nombre}`,
                miembro: miembroActualizado
            };

        } catch (error) {
            throw new Error(`Error quitando entrenador: ${error.message}`);
        }
    }

    // 📌 LISTAR MIEMBROS
    async listar() {
        return await MiembroModel.listar();
    }

    // 📌 BUSCAR POR ID
    async buscarPorId(id) {
        if (!id || id.length !== 6) {
            throw new Error('ID inválido');
        }
        return await MiembroModel.buscarPorId(id);
    }

    // 📌 ACTUALIZAR MIEMBRO
    

    async actualizar(id, data) {
    try {
        id = id.trim();
        if (!id || id.length !== 6) throw new Error('ID inválido');

        const miembroActual = await this.buscarPorId(id);

       
        const updates = {
            nombre: data.nombre ? data.nombre.trim() : miembroActual.nombre,
            direccion: data.direccion ? data.direccion.trim() : miembroActual.direccion,
            telefono: data.telefono ? data.telefono.trim() : miembroActual.telefono,
            
          
            plan_actual_id: data.plan_actual_id || miembroActual.plan_actual_id,
            entrenador_id: data.entrenador_id || miembroActual.entrenador_id,
            estadoMembresia: data.estadoMembresia || miembroActual.estado_membresia,
            
         
            fecha_vencimiento: miembroActual.fecha_vencimiento 
        };

      
        if (data.telefono && data.telefono !== miembroActual.telefono) {
             const telefonoExiste = await MiembroModel.telefonoExiste(updates.telefono, id);
             if (telefonoExiste) throw new Error('El teléfono ya está en uso');
        }

        
        return await MiembroModel.actualizar(id, updates);

    } catch (error) {
        throw error;
    }
}


    // 📌 ELIMINAR MIEMBRO
    async eliminar(id) {
        if (!id || id.length !== 6) {
            throw new Error('ID inválido');
        }
        return await MiembroModel.eliminar(id);
    }
}

module.exports = new MiembroService();