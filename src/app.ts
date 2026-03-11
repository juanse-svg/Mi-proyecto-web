import express, { Application, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

//Repositorios
import {RepositorioMesaMysql} from './infraestructura/repositorios/RepositorioMesaMysql';
import {RepositorioReservaMysql}from'./infraestructura/repositorios/RepositorioReservaMysql';
import {RepositorioUsuarioMysql}from './infraestructura/repositorios/RepositorioUsuarioMysql';

//casos de uso auth
import { RegistrarUsuario } from './aplicacion/auth/RegistrarUsuario';
import { LoginUsuario } from './aplicacion/auth/LoginUsuario';
import { LogoutUsuario } from './aplicacion/auth/LogoutUsuario';

// Casos de uso reservas
import { CrearReserva } from './aplicacion/reservas/CrearReserva';
import { ObtenerReservas } from './aplicacion/reservas/ObtenerReservas';
import { ObtenerReservaPorId } from './aplicacion/reservas/ObtenerReservaPorId';
import { ActualizarReserva } from './aplicacion/reservas/ActualizarReserva';
import { CancelarReserva } from './aplicacion/reservas/CancelarReserva';
import { GenerarReporte } from './aplicacion/reportes/GenerarReporte';  


//casos de uso mesas
import { CrearMesa } from './aplicacion/mesas/CrearMesa';
import { ObtenerMesas } from './aplicacion/mesas/ObtenerMesas';
import { ActualizarMesa } from './aplicacion/mesas/ActualizarMesa';
import { EliminarMesa } from './aplicacion/mesas/EliminarMesa';

//controladores
import { AuthController } from './infraestructura/http/controllers/AuthController';
import { ReservaController } from './infraestructura/http/controllers/ReservaController';
import { MesaController} from './infraestructura/http/controllers/MesaController';
import { ReporteController } from './infraestructura/http/controllers/ReporteController';  
//rutas
import { crearAuthRouter } from './infraestructura/http/rutas/auth.rutas';
import { crearReservasRouter } from './infraestructura/http/rutas/reservas.rutas';
import { crearMesasRouter } from './infraestructura/http/rutas/mesas.rutas';
import { crearReportesRouter } from './infraestructura/http/rutas/reportes.rutas';  




const app: Application = express();
app.use(express.json());


app.get('/api/docs', (req: Request, res: Response) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restaurante API - Documentación</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/docs/swagger.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true
    });
  </script>
</body>
</html>
  `);
});

app.get('/api/docs/swagger.json', (req: Request, res: Response) => {
  const swaggerPath = path.join(__dirname, 'infraestructura/http/swagger.json');
  const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  res.json(swaggerDoc);
});



//instanciamiento repositorios
const usuarioRepo= new RepositorioUsuarioMysql();
const mesaRepo = new RepositorioMesaMysql();
const reservaRepo= new RepositorioReservaMysql();

//instanciar casos de uso auth
const registrarUsuario = new RegistrarUsuario(usuarioRepo);
const loginUsuario = new LoginUsuario (usuarioRepo);
const logoutUsuario= new LogoutUsuario();

// instanciar casos de uso reserva
const crearReserva = new CrearReserva(reservaRepo,mesaRepo);
const obtenerReservas =new ObtenerReservas(reservaRepo);
const obtenerReservaPorId = new ObtenerReservaPorId(reservaRepo);
const actualizarReserva = new ActualizarReserva(reservaRepo);
const cancelarReserva= new CancelarReserva(reservaRepo);

// casos de uso mesas
const crearMesa    = new CrearMesa(mesaRepo);
const obtenerMesas = new ObtenerMesas(mesaRepo);
const actualizarMesa = new ActualizarMesa(mesaRepo);
const eliminarMesa = new EliminarMesa(mesaRepo);

//reportes
const generarReporte = new GenerarReporte(reservaRepo, mesaRepo);  


//casos de uso controladores
const authController    = new AuthController(registrarUsuario, loginUsuario, logoutUsuario);
const reservaController = new ReservaController(crearReserva, obtenerReservas, obtenerReservaPorId, actualizarReserva, cancelarReserva);
const mesaController    = new MesaController(crearMesa, obtenerMesas, actualizarMesa, eliminarMesa);
const reporteController = new ReporteController(generarReporte); 


//rutas
app.use('/api/auth', crearAuthRouter(authController));
app.use('/api/reservas', crearReservasRouter(reservaController));
app.use('/api/mesas', crearMesasRouter(mesaController));
app.use('/api/reportes', crearReportesRouter(reporteController));

app.get('/', (req:Request,res:Response)=>{
    res.json ({mensaje: 'Api funcional'});
});
app.use((req:Request,res:Response)=>{
    res.status(404).json({mensaje:'Ruta no encontrada'});
});



export default app;