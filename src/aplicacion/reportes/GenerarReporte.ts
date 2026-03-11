import { InterfazReserva,FiltroReserva } from "../../dominio/Puertos/InterfazReserva";
import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";

export class GenerarReporte{
    constructor(
        readonly repoReserva: InterfazReserva,
        readonly repoMesa: InterfazMesa
    ){}

async ejecutar (fechaInicio: string, fechaFin:string){
    const mesas = await this.repoMesa.obtenerMesas();
    const totalCapacidad= mesas.reduce((sum, m) =>  sum + m.capacidad,0);

    if(totalCapacidad === 0){
        throw new Error ("No hay mesas disponibles")
    }


const filtro:FiltroReserva = {
    pagina: 1,
    limite: 10000,
}


const resultado = await this.repoReserva.obtenerTodas(filtro);
const reservas = resultado.datos;

const reportePorDia: {
    [fecha:string]:{
        fecha: string,
        dia_semana: string,
        reservas_confirmadas:number,
        comensales_totales:number,
        mesas_ocupadas:number,
        ocupacion_porcentaje:number

    }
}= {};

const diasSemana = [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
];

reservas.forEach((reserva) => {
            // Filtrar por rango de fecha
            if (reserva.fecha < fechaInicio || reserva.fecha > fechaFin) {
                return;
            }

            // Solo contar reservas confirmadas, ocupadas o completadas
            if (
                ![
                    "Confirmada",
                    "Ocupada",
                    "Completada",
                    "confirmada",
                    "ocupada",
                    "completada",
                ].includes(reserva.estado)
            ) {
                return;
            }

          
            
            const fecha = typeof reserva.fecha === 'string' 
    ? reserva.fecha.split('T')[0] 
    : new Date(reserva.fecha).toISOString().split('T')[0];

            // Si no existe este día, crearlo
            if (!reportePorDia[fecha]) {
                const date = new Date(`${fecha}T00:00:00`);
                const diaSemana = diasSemana[date.getDay()];

                reportePorDia[fecha] = {
                    fecha,
                    dia_semana: diaSemana,
                    reservas_confirmadas: 0,
                    comensales_totales: 0,
                    mesas_ocupadas: 0,
                    ocupacion_porcentaje: 0,
                };
            }

            // Agregar datos de esta reserva al día
            reportePorDia[fecha].reservas_confirmadas++;
            reportePorDia[fecha].comensales_totales += reserva.num_comensales;
            reportePorDia[fecha].mesas_ocupadas++;
       
        });

  const reporte = Object.values(reportePorDia)
            .map((dia) => ({
                ...dia,
                ocupacion_porcentaje: Math.round(
                    (dia.comensales_totales / totalCapacidad) * 100
                ),
            }))
            .sort(
                (a, b) =>
                    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
            );

        // ENCONTRAR DÍA DE MAYOR OCUPACIÓN (para Gerente)
        const diaMaximoOcupacion = reporte.reduce(
            (max, dia) =>
                dia.ocupacion_porcentaje > max.ocupacion_porcentaje ? dia : max,
            reporte[0] || {
                fecha: "",
                dia_semana: "N/A",
                reservas_confirmadas: 0,
                comensales_totales: 0,
                mesas_ocupadas: 0,
                ocupacion_porcentaje: 0,
            }
        );

        // RETORNAR REPORTE COMPLETO
        return {
            resumen: {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                dia_mayor_ocupacion: diaMaximoOcupacion.dia_semana,
                ocupacion_maxima: diaMaximoOcupacion.ocupacion_porcentaje + "%",
                total_comensales: reporte.reduce(
                    (sum, d) => sum + d.comensales_totales,
                    0
                ),
                total_reservas: reporte.reduce(
                    (sum, d) => sum + d.reservas_confirmadas,
                    0
                ),
                total_capacidad: totalCapacidad,
                numero_mesas: mesas.length,
            },
            detalle_por_dia: reporte,
        };





}


}