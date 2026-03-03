import RolUsuario from "../../dominio/Enum/RolUsuario";
import { InterfazUsuario } from "../../dominio/Puertos/InterfazUsuario";
import { Usuario } from "../../dominio/entidades/Usuario";
import bcrypt from 'bcrypt';


export class RegistrarUsuario{
    constructor( readonly repoUsuario:InterfazUsuario){    }

async ejecutar(datos:{
nombre:string;
email:string;
contraseña:string;
telefono:number;

}):Promise<Omit<Usuario,'contraseña'>>{

    if (!datos.nombre||datos.nombre.trim()===''){
    throw new Error('Un nombre es obligatorio');
}

if(!datos.email||!datos.email.includes('@')){
    throw new Error('Email no es valido');

}
if (!datos.contraseña||datos.contraseña.length <8){
    throw new Error('La contraseña debe de tener minimo 8 caracteres')
}


const existe =await this.repoUsuario.obtenerPorEmail(datos.email);
if (existe){
    throw new Error('Ya existe un usuario registrado con este email');
}

const hash =await bcrypt.hash(datos.contraseña,10);

const usuario:Usuario ={
    nombre: datos.nombre.trim(),
    email: datos.email.toLowerCase().trim(),
    contraseña: hash,
    telefono: datos.telefono,
    rol:RolUsuario.Cliente,
    creada_a_las:''
};

const creado =await this.repoUsuario.crear(usuario);

const {contraseña, ...usuarioSinPassword}=creado;
return usuarioSinPassword;
}

}





