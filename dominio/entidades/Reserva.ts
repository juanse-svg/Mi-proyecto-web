import EstadoReserva from "../Enum/EstadoReserva";

export interface Reserva{
id? : number;
usuario_id:number;
mesa_id:number;
fecha: string,
hora_inicio:string,
hora_fin:string,
num_comensales:number,
estado:EstadoReserva

}