import { Router } from 'express';
import { ReservaController } from '../controllers/ReservaController';
import { autenticar } from '../middleware/autenticacion.middleware';
import { autorizar } from '../middleware/autorizacion.middleware';

export const crearReservasRouter = (controller: ReservaController): Router => {
  const router = Router();

  router.post('/',
    autenticar,
    autorizar('cliente', 'host', 'gerente'),
    controller.crear
  );

  
  router.get('/',
    autenticar,
    autorizar('host', 'gerente'),
    controller.obtenerTodas
  );

  router.get('/:id',
    autenticar,
    autorizar('host', 'gerente'),
    controller.obtenerPorId
  );

  router.patch('/:id',
    autenticar,
    autorizar('host', 'gerente'),
    controller.actualizar
  );

  router.patch('/:id/cancelar',
    autenticar,
    autorizar('cliente', 'host', 'gerente'),
    controller.cancelar
  );

  return router;
};