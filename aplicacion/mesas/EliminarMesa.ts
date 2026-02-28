import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";


export class EliminarMesa{
    constructor(private repoMesa:InterfazMesa){}

    async ejecutar (id:number): Promise <{mensaje:string}>{
if(!id || id <= 0){
    throw new Error ('El id de la mesa no es valido')
}

const mesa =await this.repoMesa.obtenerPorId(id);
if(!mesa){
    throw new Error ('Mesa no encontrada')
}

if (mesa.estado === 'Ocupada'|| mesa.estado ==='Reservada'){
    throw new Error ('No se puede eliminar una mesa ocupada o reservada')

}
const eliminada =await this.repoMesa.eliminar(id);
if(!eliminada){
    throw new Error('No se pudo eliminar la mesa')

}
return {mensaje : 'Mesa eliminada exitosamente'}
    }
}