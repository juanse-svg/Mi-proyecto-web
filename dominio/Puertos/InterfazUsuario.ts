import { Usuario } from "../entidades/Usuario";

export interface InterfazUsuario{
crear(usuario:Usuario):Promise<Usuario>;
obtenerPorEmail(email:string):Promise<Usuario|null>;
obtenerPorId(id:number):Promise<Usuario|null>;
actualizar(id:number,datos:Partial<Usuario>):Promise<Usuario|null>;


}