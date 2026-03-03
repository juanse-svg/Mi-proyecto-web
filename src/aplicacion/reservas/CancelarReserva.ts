import { InterfazReserva } from "../../dominio/Puertos/InterfazReserva";

export class CancelarReserva {
    constructor (readonly repoReserva: InterfazReserva){}   

    async ejecutar (id:number, usuario_id:number, rol:string): Promise <{mensaje:string}>{
if (!id || id <= 0){
    throw new Error ('El id de la reserva no es valido');
}

const reserva = await this.repoReserva.obtenerPorId(id);
if(!reserva){
    throw new Error ('Reserva no encontrada');
}

if (reserva.estado === 'Cancelada'){
    throw new Error ('La reserva ya fue cancelada');
}

if (reserva.estado === 'Completada'){
    throw new Error ('No se puede cancelar una reserva ya completada')
}

if (rol === 'Cliente' && reserva.usuario_id !== usuario_id){
    throw new Error ('No tienes permiso para cancelar esta reserva')
}

if (rol === 'Cliente'){
    const ahora = new Date();
    const fechaHoraReserva = new Date (`${reserva.fecha}-T${reserva.hora_inicio}`);
    const diferenciaHoras = (fechaHoraReserva.getTime()- ahora.getTime()) / (1000*60*60);

if (diferenciaHoras <24){
    throw new Error ('Solo se pueden cancelar reservas con un maximo de 24 horas de antelacion')
}

}

const cancelada = await this.repoReserva.cancelar(id);
if(!cancelada){
    throw new Error ('No fue posible cancelar su reserva')
}

return {mensaje: 'Su reserva fue cancelada correctamente'}

    }


}
