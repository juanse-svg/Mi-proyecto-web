import FormaMesa from "../Enum/FormaMesa";
import Estadomesa from "../Enum/EstadoMesa";

export interface Mesa{
id?:number,
numero:number,
capacidad: number,
ubicacion?:string,
forma:FormaMesa,
estado:Estadomesa,
creada_a_las?:string,
actualizada_a_las?:string
}