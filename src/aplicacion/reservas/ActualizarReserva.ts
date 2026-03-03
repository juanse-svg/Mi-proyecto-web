import { InterfazReserva } from "../../dominio/Puertos/InterfazReserva";
import { Reserva } from "../../dominio/entidades/Reserva";
import EstadoReserva from "../../dominio/Enum/EstadoReserva";


export class ActualizarReserva{
    constructor (readonly repoReserva :InterfazReserva){}

    async juntar (
        id:number,
        datos: {
            estado:EstadoReserva;
            notas:string;
            num_comensales:number;
        }
    ): Promise <Reserva>{
if (!id || id <= 0){
    throw new Error ('El id de la reserva no es valido ');
}

const reserva= await this.repoReserva.obtenerPorId(id);
if (!reserva){
    throw new Error ('Reserva no encontrada')
}

if (reserva.estado === 'Cancelada'){
    throw new Error ('No es posible modificar una reserva despues de cancelada');
}

if (reserva.estado === 'Completada'){
    throw new Error ('No es posible modificar una reserva completada')
}

if(datos.num_comensales != undefined && datos.num_comensales <= 0){
    throw new Error ('El numero minimo de comensales debe ser 1')

}

const actualizada = await this.repoReserva.actualizar(id,datos);
if(!actualizada){
    throw new Error ('No fue posible actualizar la reserva');
}
return actualizada;
    }

}