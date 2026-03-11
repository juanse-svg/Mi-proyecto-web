import { Request, Response, NextFunction } from 'express';

export const autorizar = (...rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = (req as any).usuario;

    const rolUsuario = usuario?.rol?.toString().trim().toLowerCase();
    const roles = rolesPermitidos.map(r => r.toLowerCase());

    if (!usuario || !roles.includes(rolUsuario)) {
      res.status(403).json({
        mensaje: 'No tienes permisos para esta acción',
        rol: rolUsuario,
        permitidos: roles
      });
      return;
    }

    next();
  };
};