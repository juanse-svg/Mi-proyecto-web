import { InterfazMesa } from "../../dominio/Puertos/InterfazMesa";
import { Mesa } from "../../dominio/entidades/Mesa";
import { pool } from "../db/connection";
import { RowDataPacket,ResultSetHeader } from 'mysql2';

export class RepositorioMesaMysql implements InterfazMesa{
    async crear(mesa:Mesa): Promise <Mesa> {
        const sql = 'insert into mesas (numero, capacidad, ubicacion, forma, estado) values (?,?,?,?,?';

        const [result] =await pool.execute<ResultSetHeader>(sql,[

            mesa.numero,
            mesa.capacidad,
            mesa.ubicacion ?? null,
            mesa.forma,
            mesa.estado
        ]);
        return {...mesa,id:result.insertId};
   
    }

async obtenerMesas(): Promise<Mesa[]> {
    const [rows] =await pool.execute<RowDataPacket[]>(
        'select * from mesas order by numero asc'
    );
    return rows as Mesa[];
}

async obtenerPorId(id: number): Promise<Mesa | null> {
const [rows] =await pool.execute<RowDataPacket[]>(
    'Select * from mesas where id=?',
    [id]
);
if(rows.length === 0)return null;
return rows[0]as Mesa;
}

async ObtenerDisponibles(num_comensales: number, fecha: string, hora_inicio: string, hora_fin: string): Promise<Mesa[]> {
    const sql = `
      SELECT * FROM mesas
      WHERE capacidad >= ?
      AND id NOT IN (
        SELECT mesa_id FROM reservas
        WHERE fecha = ?
        AND estado NOT IN ('cancelada', 'no_show')
        AND hora_inicio < ? AND hora_fin > ?
      )
      ORDER BY capacidad ASC
    `;

    const [rows]= await pool.execute<RowDataPacket[]>(sql,[
        num_comensales,
        fecha,
        hora_fin,
        hora_inicio,
    ]);
    return rows as Mesa[];
}

async actualizar(id: number, datos: Partial<Mesa>): Promise<Mesa | null> {
    const campos: string[] =[];
    const valores: (string |number)[]=[];
 if(datos.numero !== undefined) {campos.push('numero=?');valores.push(datos.numero); }
 if(datos.capacidad !== undefined) {campos.push('capacidad=?');valores.push(datos.capacidad); }
 if(datos.ubicacion !== undefined) {campos.push('ubicacion=?');valores.push(datos.ubicacion); }
 if(datos.forma !== undefined) {campos.push('forma=?');valores.push(datos.forma); }
 if(datos.estado !== undefined) {campos.push('estado=?');valores.push(datos.estado); }

if(campos.length === 0 ) return await this.obtenerPorId(id);

valores.push.apply(id);
await pool.execute<ResultSetHeader>(
    `UPDATE mesas SET ${campos.join(', ')} WHERE id = ?`,
    valores
);
return await this.obtenerPorId(id);
}

async eliminar(id: number): Promise<boolean> {
    const [result] =await pool.execute<ResultSetHeader>(
        'Delete from mesas where id = ?',
        [id]
    );
    return result.affectedRows>0;
}

}