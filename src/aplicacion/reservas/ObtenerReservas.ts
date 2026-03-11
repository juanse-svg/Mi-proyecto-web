import { InterfazReserva,FiltroReserva } from "../../dominio/Puertos/InterfazReserva";

import { Reserva } from "../../dominio/entidades/Reserva";


export class ObtenerReservas{
    constructor(readonly repoReserva:InterfazReserva){}

async ejecutar(filtro: FiltroReserva = {} as FiltroReserva): Promise <{datos:Reserva[];total:number;pagina:number;limite:number}>{

const pagina = filtro.pagina && filtro.pagina >0 ? filtro.pagina:1;
const limite = filtro.limite && filtro.limite >0 ? filtro.limite:10;

const resultado = await this.repoReserva.obtenerTodas({
...filtro,
pagina,
limite

});

return {
    datos: resultado.datos,
    total: resultado.total,
    pagina,
    limite
}

}}
