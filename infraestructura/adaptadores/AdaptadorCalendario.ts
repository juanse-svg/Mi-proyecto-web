export interface ServicioCalendario {
    crearEvento (titulo:string, fecha:string,hora:string,duracion:number): Promise <string>;
    cancelarEvento (eventoId:string): Promise<boolean>;
}


export class AdaptadorCalendario implements ServicioCalendario{
    async crearEvento (
        titulo: string,
        fecha:string,
        hora:string,
        duracion:number
    ): Promise <string>{
    const id = `evento-${Date.now()}`;
    console.log(`[Calendario] Evento creado ${titulo} | ${fecha} ${hora} | ${duracion} min | ID: ${id}`);
    return id;
}

async cancelarEvento(eventoId:string): Promise <boolean> {
    console.log (`[Calendario] Evento cancelado ${eventoId}`);
    return true;
}

}