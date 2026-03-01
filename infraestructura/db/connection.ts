import mysql, {Pool} from 'mysql2/promise';
import { config } from '../config/config';

export const pool: Pool = mysql.createPool({

host:config.db.host,
user: config.db.user,
password:config.db.password,
database:config.db.database,
waitForConnections:true,
connectionLimit: 10


});