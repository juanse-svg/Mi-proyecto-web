import { Request,Response } from "express";
import { CrearMesa } from "../../../aplicacion/mesas/CrearMesa";
import { ObtenerMesas } from "../../../aplicacion/mesas/ObtenerMesas";
import { ActualizarMesa } from "../../../aplicacion/mesas/ActualizarMesa";
import { EliminarMesa } from "../../../aplicacion/mesas/EliminarMesa";


export class MesaController {
    constructor(
        private crearMesa:CrearMesa,
        private obtenerMesas:ObtenerMesas,
        private actualizarMesa:ActualizarMesa,
        private eliminarMesa:EliminarMesa

    ){}
crear = async( req:Request,res:Response): Promise<void> =>{
    try{
        const mesa= await this.crearMesa.ejecutar(req.body);
        res.status(201).json({mensaje: 'Mesa creada con exito',mesa});

    } catch (error:any){
        res.status(400).json({mensaje:error.message})
    }
}

obtenerTodas = async (req:Request,res:Response): Promise <void>=>{
    try{
        const mesas= await this.obtenerMesas.ejecutar();
        res.status(200).json(mesas);
    }catch(error:any){
        res.status(400).json ({mensaje:error.message})
    }
}


actualizar = async (req:Request,res:Response): Promise <void> => {
    try{
        const id =Number(req.params.id);
        const mesa = await this.actualizarMesa.ejecutar(id,req.body);
        res.status(400).json({mensaje: 'Mesa actualizada con exito', mesa});
    } catch (error:any){
        res.status(400).json({mensaje: error.message});
    }
}

eliminar = async (req:Request, res:Response): Promise <void> =>{
    try{
        const id= Number(req.params.id);
        const resultado= await this.eliminarMesa.ejecutar(id);
            res.status(200).json(resultado)
        
    }catch (error:any){
        res.status(400).json({mensaje:error.message})
    }
}
















}