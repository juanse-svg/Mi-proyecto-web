import express, { Application, Request, Response } from 'express';


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

//casos de uso mesas
import { CrearMesa } from './aplicacion/mesas/CrearMesa';
import { ObtenerMesas } from './aplicacion/mesas/ObtenerMesas';
import { ActualizarMesa } from './aplicacion/mesas/ActualizarMesa';
import { EliminarMesa } from './aplicacion/mesas/EliminarMesa';

//controladores
import { AuthController } from './infraestructura/http/controllers/AuthController';
import { ReservaController } from './infraestructura/http/controllers/ReservaController';
import { MesaController} from './infraestructura/http/controllers/MesaController';

//rutas
import { crearAuthRouter } from './infraestructura/http/rutas/auth.rutas';
import { crearReservasRouter } from './infraestructura/http/rutas/reservas.rutas';
import { crearMesasRouter } from './infraestructura/http/rutas/mesas.rutas';





const app: Application = express();
app.use(express.json());

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

//casos de uso controladores
const authController    = new AuthController(registrarUsuario, loginUsuario, logoutUsuario);
const reservaController = new ReservaController(crearReserva, obtenerReservas, obtenerReservaPorId, actualizarReserva, cancelarReserva);
const mesaController    = new MesaController(crearMesa, obtenerMesas, actualizarMesa, eliminarMesa);


//rutas
app.use('/api/auth', crearAuthRouter(authController));
app.use('/api/reservas', crearReservasRouter(reservaController));
app.use('/api/mesas', crearMesasRouter(mesaController));

app.get('/', (req:Request,res:Response)=>{
    res.json ({mensaje: 'Api funcional'});
});
app.use((req:Request,res:Response)=>{
    res.status(404).json({mensaje:'Ruta no encontrada'});
});



export default app;