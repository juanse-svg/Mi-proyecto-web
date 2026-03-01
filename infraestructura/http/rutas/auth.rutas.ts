import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { autenticar } from '../middleware/autenticacion.middleware';

export const crearAuthRouter = (controller: AuthController): Router => {
  const router = Router();

  router.post('/registro', controller.registrar);
  router.post('/login',    controller.login);
  router.post('/logout',   autenticar, controller.logout);

  return router;
};