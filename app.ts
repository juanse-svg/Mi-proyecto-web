// src/app.ts
import express, { Application, Request, Response } from 'express';


const app: Application = express();
app.use(express.json());

// Repositorios
const usuarioRepo   = new MysqlUsuarioRepository();
const mesaRepo      = new MysqlMesaRepository();
const reservaRepo   = new MysqlReservaRepository();

// Casos de uso auth
const registrarUsuario = new RegistrarUsuario(usuarioRepo);
const loginUsuario     = new LoginUsuario(usuarioRepo);
const logoutUsuario    = new LogoutUsuario();

// Casos de uso reservas
const crearReserva       = new CrearReserva(reservaRepo, mesaRepo);
const obtenerReservas    = new ObtenerReservas(reservaRepo);
const obtenerReservaPorId = new ObtenerReservaPorId(reservaRepo);
const actualizarReserva  = new ActualizarReserva(reservaRepo);
const cancelarReserva    = new CancelarReserva(reservaRepo);

// Casos de uso mesas
const crearMesa     = new CrearMesa(mesaRepo);
const obtenerMesas  = new ObtenerMesas(mesaRepo);
const actualizarMesa = new ActualizarMesa(mesaRepo);
const eliminarMesa  = new EliminarMesa(mesaRepo);

// Controladores
const authController    = new AuthController(registrarUsuario, loginUsuario, logoutUsuario);
const reservaController = new ReservaController(crearReserva, obtenerReservas, obtenerReservaPorId, actualizarReserva, cancelarReserva);
const mesaController    = new MesaController(crearMesa, obtenerMesas, actualizarMesa, eliminarMesa);

// Rutas
app.use('/api/auth',     crearAuthRouter(authController));
app.use('/api/reservas', crearReservasRouter(reservaController));
app.use('/api/mesas',    crearMesasRouter(mesaController));

// Ruta base
app.get('/', (req: Request, res: Response) => {
  res.json({ mensaje: 'API Restaurante funcionando' });
});

// Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

export default app;