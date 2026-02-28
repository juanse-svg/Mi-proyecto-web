import { InterfazReserva } from "../../dominio/Puertos/InterfazReserva";
import { Reserva } from "../../dominio/entidades/Reserva";

export class ObtenerReservaPorId{
    constructor(private repoReserva:InterfazReserva){}

    async ejecutar (id:number): Promise<Reserva>{
        if (!id||id<=0){
            throw new Error('Id de reserva no valido')

        }
const reserva = await this.repoReserva.obtenerPorId(id);
if(!reserva){
    throw new Error ('Reserva no encontrada');

}
return reserva
    }
}