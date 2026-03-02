import {InterfazUsuario} from '../../dominio/Puertos/InterfazUsuario';
import { Usuario } from '../../dominio/entidades/Usuario';
import { pool } from '../db/connection';
import { RowDataPacket,ResultSetHeader } from 'mysql2';

export class RepositorioUsuarioMysql implements InterfazUsuario{

async crear (usuario:Usuario):Promise<Usuario>{
    const sql = 'INSERT INTO usuarios (nombre, email, contraseña, telefono, rol)VALUES (?, ?, ?, ?, ?)';
    
    const [result] =await pool.execute<ResultSetHeader>(sql,[
usuario.nombre,
usuario.email,
usuario.contraseña,
usuario.telefono,
usuario.rol

    ]
    );
return {...usuario,id:result.insertId};
}

async obtenerPorId(id: number): Promise<Usuario | null> {
    const [rows]= await pool.execute<RowDataPacket[]>(
        'select * from usuarios where id = ?',
        [id]
    );
    if(rows.length === 0)return null;
    return rows[0] as Usuario; 
}

async actualizar(id: number, datos: Partial<Usuario>): Promise<Usuario | null> {
    const campos: string[]=[];
    const valores: (string|number)[]=[];
if (datos.nombre) {campos.push('nombre = ?'); valores.push(datos.nombre);}
if (datos.telefono) {campos.push('telefono = ?'); valores.push(datos.telefono);}
if (datos.contraseña) {campos.push('contraseña = ?'); valores.push(datos.contraseña);}

if (campos.length === 0) return await this.obtenerPorId(id);

valores.push(id);
await pool.execute<ResultSetHeader>(
`update usuarios set ${campos.join(', ')} where id =?`,valores
);
return await this.obtenerPorId(id);
}


async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const [rows] =await pool.execute<RowDataPacket[]>(
        'select * from usuarios where email =?',
        [email]
    );
    if (rows.length === 0)return null;
    return rows[0] as Usuario;
}

}