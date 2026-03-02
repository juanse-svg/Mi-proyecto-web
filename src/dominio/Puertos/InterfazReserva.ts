import { Reserva } from "../entidades/Reserva";

export interface FiltroReserva{
    usuario_id?:number;
    mesa_id?:number;
    fecha?:string;
    estado?:string;
    pagina?:number;
    limite?:number;
}

export interface InterfazReserva{
crear(reserva:Reserva): Promise<Reserva>;
obtenerPorId(id:number): Promise<Reserva|null>;
obtenerTodas(flitros:FiltroReserva):Promise<{datos: Reserva[];total:number}>;
actualizar(id:number,datos: Partial<Reserva>): Promise <Reserva|null>;
cancelar(id:number): Promise<boolean>;
verificarDisponible(mesa_id:number,fecha:string,hora_inicio:string,hora_fin:string):Promise<boolean>;
obtenerPorUsuario(usuario_id:number):Promise<Reserva[]>;


}
