import { Request, Response } from 'express';
import { CrearReserva } from '../../../aplicacion/reservas/CrearReserva';
import { ObtenerReservas } from '../../../aplicacion/reservas/ObtenerReservas';
import { ObtenerReservaPorId } from '../../../aplicacion/reservas/ObtenerReservaPorId';
import {ActualizarReserva} from '../../../aplicacion/reservas/ActualizarReserva';
import { CancelarReserva } from '../../../aplicacion/reservas/CancelarReserva';


export class ReservaController {
    constructor(
readonly crearReserva:CrearReserva,
readonly obtenerReservas: ObtenerReservas,
readonly obtenerReservaPorId: ObtenerReservaPorId,
readonly actualizarReserva: ActualizarReserva,
readonly cancelarReserva:CancelarReserva
 ){}

 crear = async (req:Request, res:Response): Promise <void> => {
    try{
        const usuario = (req as any).usuario;
        const reserva = await this.crearReserva.ejecutar({
            ...req.body,
            usuario_id: usuario.id
        });
        res.status (201).json ({mensaje: 'Reserva creada con exito', reserva});
    
    } catch (error:any){
        res.status(400).json({mensaje: error.mensaje});
    } 
 }

 obtenerTodas = async (req:Request, res:Response): Promise <void> =>{
    try{
const filtros = {
        usuario_id: req.query.usuario_id ? Number(req.query.usuario_id) : undefined,
        mesa_id:    req.query.mesa_id    ? Number(req.query.mesa_id)    : undefined,
        fecha:      req.query.fecha      ? String(req.query.fecha)      : undefined,
        estado:     req.query.estado     ? String(req.query.estado)     : undefined,
        pagina:     req.query.pagina     ? Number(req.query.pagina)     : 1,
        limite:     req.query.limite     ? Number(req.query.limite)     : 10
      };

const resultado= await this.obtenerReservas.ejecutar(filtros);
res.status(200).json(resultado);
    }catch (error: any){
        res.status(400).json({mensaje : error.mensaje})
    }
 }

 obtenerPorId = async (req:Request, res:Response): Promise <void> => {
try {
    const id = Number(req.params.id);
    const reserva = await this.obtenerReservaPorId.ejecutar(id);
    res.status(200).json(reserva);

}catch (error:any){
    res.status(404).json({mensaje:error.mensaje});
}
 }

actualizar = async (req:Request, res: Response): Promise<void>=>{
    try{
        const id =Number(req.params.id);
        const reserva= await this.actualizarReserva.juntar(id, req.body);
        res.status(200).json({mensaje: 'Reserva actualizada con exito0', reserva})
    }catch (error:any){
        res.status(400).json({mensaje: error.mensaje})
    }
}

cancelar = async (req:Request, res:Response): Promise <void>=> {
    try{
        const id= Number (req.params.id);
        const usuario= (req as any).usuario;
        const resultado = await this.cancelarReserva.ejecutar(id,usuario.id,usuario.rol)
    res.status(200).json(resultado);
    }
    catch ( error: any){
        res.status(400).json({mensaje: error.mensaje});
    }
}
}