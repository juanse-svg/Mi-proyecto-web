import { InterfazUsuario } from "../../dominio/Puertos/InterfazUsuario";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export class LoginUsuario{
    constructor (private repoUsuario:InterfazUsuario){}

    async ejecutar(datos:{
email:string;
contraseña:string;
    }): Promise <{token:string;usuario:{id:number;nombre:string;email:string;rol:string}}>{
if(!datos.email||!datos.email.includes('@')){
    throw new Error('Email no es valido');

}

if (!datos.contraseña||datos.contraseña.trim()===''){
    throw new Error('La contraseña es obligatoria')
}
const usuario=await this.repoUsuario.obtenerPorEmail(datos.email.toLowerCase().trim());
if (!usuario){
    throw new Error ('Credenciales incorrectas')

}
const token =jwt.sign(
    {
id:usuario.id,
email:usuario.email,
rol: usuario.rol
    },
    config.jwt.secret,
    {expiresIn: config.jwt.expiracion}
);

return{
token,
usuario:{
    id: usuario.id!,
nombre:usuario.nombre,
email:usuario.email,
rol:usuario.rol
}
};

}
}