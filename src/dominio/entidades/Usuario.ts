import RolUsuario from "../Enum/RolUsuario";

export interface Usuario{
id?: number,
nombre: string,
email:string,
contraseña:string,
telefono:number,
rol:RolUsuario,
creada_a_las:string


}

