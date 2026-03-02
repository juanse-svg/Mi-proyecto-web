import app from './app';
import { config } from './infraestructura/config/config';
import { pool } from './infraestructura/db/connection';

const iniciarServidor = async (): Promise<void> => {
  try {
    // Verificar conexión a la base de datos
    const conexion = await pool.getConnection();
    conexion.release();
    console.log('✅ Conexión a la base de datos exitosa');

    app.listen(config.port, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${config.port}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

iniciarServidor();