import { Request, Response, NextFunction } from 'express';

export const autorizar = (...rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = (req as any).usuario;
    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      res.status(403).json({ mensaje: 'No tienes permisos para esta acción' });
      return;
    }
    next();
  };
};