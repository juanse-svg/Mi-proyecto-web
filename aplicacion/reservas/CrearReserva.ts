import { InterfazReserva } from "../../dominio/Puertos/InterfazReserva";
import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";
import { Reserva } from "../../dominio/entidades/Reserva";
import { config } from "../../infraestructura/config/config";

export class CrearReserva{
constructor (
    private repoReserva:InterfazReserva,
    private repoMesa:InterfazMesa
){}

async ejecutar(datos: {
    usuario_id:number;
    mesa_id:number;
    fecha:string;
    hora_inicio:string;
numero_comensales:number;
notas:string;
}): Promise <Reserva> {

if(!datos.fecha||datos.fecha.trim ()===''){
    throw new Error('La fecha de la reserva es obligatoria')
}

if(!datos.hora_inicio|| datos.hora_inicio.trim()===''){
    throw new Error ('La hora de inicio de la reserva es obligatoria')
}

if (!datos.numero_comensales|| datos.numero_comensales<=0){
    throw new Error ('Se debe tener al menos 1 comensal para reservar')
}

if(!datos.usuario_id){
    throw new Error ('El usuario es obligatorio')
}
if(!datos.mesa_id){
    throw new Error ('Se debe asignar una mesa para la reserva')
}
const hora_fin = this.calcularHoraFin(
    datos.hora_inicio,
    config.restaurante.duracion_reserva_min
);

if (!this.dentroDeHorario(
    datos.hora_inicio,
    hora_fin,
    config.restaurante.hora_apertura,
    config.restaurante.hora_cierre

)){
    throw new Error('La reserva debe ser dentro de${config.restaurante.hora_apertura} y ${config.restaurante.hora_cierre}'
      ); 
}

//verificar que la mesa existe

const mesa = await this.repoMesa.obtenerPorId(datos.mesa_id);
if(!mesa){
    throw new Error ('La mesa no existe');
}

//verificar capacidad de la mesa
if(mesa.capacidad<datos.numero_comensales){
    throw new Error ('La mesa solo tiene capacidad para ${mesa.capacidad} personas');
}

//verificar conflicto de horario
const disponible =await this.repoReserva.verificarDisponible(
    datos.mesa_id,
    datos.fecha,
    datos.hora_inicio,
    hora_fin
);

if(!disponible){
    throw new Error ('La mesa no esta disponible en dicho horario')
}
const reserva: Reserva ={
    usuario_id: datos.usuario_id,
    mesa_id:datos.mesa_id,
    fecha: datos.fecha,
    hora_inicio:datos.hora_inicio,
    hora_fin,
    num_comensales:datos.numero_comensales,
    estado:'Pendiente',

}
return await this.repoReserva.crear(reserva);

}

private calcularHoraFin (hora_inicio:string,duracion_min:number): string{
    const [h, m]=hora_inicio.split(':').map(Number);
    const totalMin= h*60 +m+duracion_min;
    const hFin=Math.floor(totalMin/60).toString().padStart(2,'0');
    const mFin=Math.floor(totalMin%60).toString().padStart(2,'0');
    return '${hFin}:${mFin}:00';

}

private dentroDeHorario(
    inicio:string,
    fin:string,
    apertura:string,
    cierre:string,

): boolean {
    return inicio >= apertura && fin <= cierre;
}


}


