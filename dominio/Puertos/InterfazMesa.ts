import { Mesa } from "../entidades/Mesa";


export interface InterfazMesa{
crear(mesa:Mesa):Promise<Mesa>;
obtenerMesas():Promise<Mesa>;
obtenerPorId(id:number):Promise<Mesa|null>;
ObtenerDisponibles(num_comensales:number,fecha:string,hora_inicio:string,hora_fin:string):Promise<Mesa[]>;
actualizar(id:number,datos:Partial<Mesa>):Promise<Mesa|null>;
eliminar(id:number):Promise<boolean>




}