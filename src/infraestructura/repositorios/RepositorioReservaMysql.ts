import { InterfazReserva,FiltroReserva } from "../../dominio/Puertos/InterfazReserva";
import { Reserva } from "../../dominio/entidades/Reserva";
import { pool } from "../db/connection";
import { RowDataPacket,ResultSetHeader } from "mysql2";

export class RepositorioReservaMysql implements InterfazReserva{

async crear(reserva: Reserva): Promise<Reserva> {
    const sql = `
      INSERT INTO reservas (usuario_id, mesa_id, fecha, hora_inicio, hora_fin, num_comensales, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute <ResultSetHeader> (sql,[
         reserva.usuario_id,
      reserva.mesa_id,
      reserva.fecha,
      reserva.hora_inicio,
      reserva.hora_fin,
      reserva.num_comensales,
      reserva.estado,
  
    ]);
    return {...reserva, id:result.insertId};
}
async obtenerPorId(id: number): Promise<Reserva | null> {
    const[rows] =await pool.execute<RowDataPacket[]>(
        'select * from reservas where id = ?',
        [id]
    );
    if (rows.length ===0) return null;
    return rows[0]as Reserva;
}

async obtenerTodas(flitros: FiltroReserva): Promise<{ datos: Reserva[]; total: number; }> {
    const condiciones : string[] = [];
    const valores : (string | number)[]=[];

if (flitros.usuario_id){condiciones.push('usuario_id= ?'); valores.push(flitros.usuario_id);}
if (flitros.mesa_id){condiciones.push('mesa_id= ?'); valores.push(flitros.mesa_id);}
if (flitros.fecha){condiciones.push('fecha= ?'); valores.push(flitros.fecha);}
if (flitros.estado){condiciones.push('estado= ?'); valores.push(flitros.estado);}

const where =condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

const pagina =flitros.pagina ?? 1;
const limite = flitros.limite ??10;
const offset = (pagina -1) *limite;

const [countRows] = await pool.execute<RowDataPacket []>(
`SELECT COUNT(*) as total FROM reservas ${where}`,
valores
);
const total = (countRows[0]as {total : number}).total;

const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM reservas ${where} ORDER BY fecha ASC, hora_inicio ASC LIMIT ? OFFSET ?`,
[...valores, limite, offset]


);
return {datos:rows as Reserva[], total};
}

async verificarDisponible(mesa_id: number, fecha: string, hora_inicio: string, hora_fin: string): Promise<boolean> {
    let sql =`
      SELECT COUNT(*) as total FROM reservas
      WHERE mesa_id = ?
      AND fecha = ?
      AND estado NOT IN ('cancelada', 'no_show')
      AND hora_inicio < ? AND hora_fin > ?
    `;

    const valores : (string |number)[]= [mesa_id,fecha,hora_fin,hora_inicio];
const [rows]= await pool.execute<RowDataPacket[]>(sql,valores);
return (rows[0] as {total:number}).total ===0;
    
}

async cancelar(id: number): Promise<boolean> {
    const [result]= await pool.execute <ResultSetHeader>(
        "UPDATE reservas SET estado = 'cancelada' WHERE id = ?",
    [id]
    );
    return result.affectedRows >0;
}


async actualizar(id: number, datos: Partial<Reserva>): Promise<Reserva | null> {
    const campos : string[]= [];
    const valores: (string | number)[]=[];

    if(datos.estado != undefined) {campos.push('estado = ?'); valores.push(datos.estado); }
    if(datos.num_comensales != undefined) {campos.push('num_comensales = ?'); valores.push(datos.num_comensales); }
   
if (campos.length === 0 ) return await this.obtenerPorId(id);

valores.push(id);
await pool.execute<ResultSetHeader>(
    `UPDATE reservas SET ${campos.join(', ')} WHERE id = ?`,
    valores
);
return await this.obtenerPorId(id);

}

async obtenerPorUsuario(usuario_id: number): Promise<Reserva[]> {
    const [rows] = await pool.execute <RowDataPacket[]>(
        'SELECT * FROM reservas WHERE usuario_id = ? ORDER BY fecha DESC, hora_inicio DESC',
        [usuario_id]
    );
return rows as Reserva[];
}

}