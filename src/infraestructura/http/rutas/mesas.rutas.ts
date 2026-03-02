// src/infrastructure/http/routes/mesas.routes.ts
import { Router } from 'express';
import { MesaController } from '../controllers/MesaController';
import { autenticar } from '../middleware/autenticacion.middleware';
import { autorizar } from '../middleware/autorizacion.middleware';



export const crearMesasRouter = (controller: MesaController): Router => {
  const router = Router();

  router.get('/',
    autenticar,
    autorizar('cliente', 'host', 'gerente'),
    controller.obtenerTodas
  );

  router.post('/',
    autenticar,
    autorizar('gerente'),
    controller.crear
  );

  router.patch('/:id',
    autenticar,
    autorizar('host', 'gerente'),
    controller.actualizar
  );

  router.delete('/:id',
    autenticar,
    autorizar('gerente'),
    controller.eliminar
  );

  return router;
};