import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";
import { Mesa } from "../../dominio/entidades/Mesa";

export class ActualizarMesa{
    constructor(private repoMesa:InterfazMesa){}

async ejecutar(id:number,datos:Partial<Mesa>):Promise<Mesa>{

    if(!id || id <= 0){
        throw new Error ('El id de la mesa no es valido');
    }
const mesa =await this.repoMesa.obtenerPorId(id);
if(!mesa){
    throw new Error ('Mesa no encontrada');
}

if(datos.capacidad !== undefined && datos.capacidad <= 0){
    throw new Error('La capacidad de una mesa debe ser mayor a 0')
}

const actualizada = await this.repoMesa.actualizar(id,datos);
if(!actualizada){
    throw new Error('No se pudo actualizar la mesa');
}

return actualizada;
}

}