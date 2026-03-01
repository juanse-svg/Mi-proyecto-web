import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";
import { Mesa } from "../../dominio/entidades/Mesa";
import Estadomesa from "../../dominio/Enum/EstadoMesa";
import FormaMesa from "../../dominio/Enum/FormaMesa";

export class CrearMesa{
    constructor (private repoMesa: InterfazMesa){}

    async ejecutar (datos:{
        numero:number;
        capacidad:number;
        ubicacion:string;
        forma:FormaMesa
        estado:Estadomesa
    }): Promise <Mesa>{
if(!datos.numero || datos.numero <= 0){
    throw new Error ('El numero de mesa no es valido')
}
if (!datos.capacidad|| datos.capacidad<=0){
    throw new Error('La capacidad minima de una mesa debe ser 1 o mayor')
}

const mesa :Mesa ={
    numero : datos.numero,
    capacidad : datos.capacidad,
    ubicacion:datos.ubicacion,
    forma: datos.forma,
    estado: Estadomesa.Disponible
}
return await this.repoMesa.crear(mesa);

    }
}