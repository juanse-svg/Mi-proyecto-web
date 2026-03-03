// src/tests/unit/CrearReserva.test.ts
import { CrearReserva } from '../../aplicacion/reservas/CrearReserva';
import { InterfazReserva } from '../../dominio/Puertos/InterfazReserva';
import { InterfazMesa } from '../../dominio/Puertos/InterfazMesa';
import { Mesa } from '../../dominio/entidades/Mesa';
import { Reserva } from '../../dominio/entidades/Reserva';
import EstadoReserva from '../../dominio/Enum/EstadoReserva';

const mockReservaRepo: jest.Mocked<InterfazReserva> = {
  crear: jest.fn(),
  obtenerPorId: jest.fn(),
  obtenerTodas: jest.fn(),
  actualizar: jest.fn(),
  cancelar: jest.fn(),
  verificarDisponible: jest.fn(),
  obtenerPorUsuario: jest.fn()
};

const mockMesaRepo: jest.Mocked<InterfazMesa> = {
  crear: jest.fn(),
  obtenerMesas: jest.fn(),
  obtenerPorId: jest.fn(),
  ObtenerDisponibles: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn()
};

describe('CrearReserva', () => {
  let crearReserva: CrearReserva;

  beforeEach(() => {
    jest.clearAllMocks();
    crearReserva = new CrearReserva(mockReservaRepo, mockMesaRepo);
  });

  const datosValidos = {
    usuario_id: 1,
    mesa_id: 1,
    fecha: '2026-12-01',
    hora_inicio: '13:00',
    numero_comensales: 2,
    notas: ''
  };

  const mesaMock: Mesa = {
    id: 1,
    numero: 1,
    capacidad: 4,
    forma: 'cuadrada' as any,
    estado: 'disponible' as any
  };

  const reservaMock: Reserva = {
    id: 1,
    usuario_id: 1,
    mesa_id: 1,
    fecha: '2026-12-01',
    hora_inicio: '13:00',
    hora_fin: '14:30',
    num_comensales: 2,
    estado: EstadoReserva.Pendiente
  };

  it('debe lanzar error si la fecha esta vacia', async () => {
    await expect(crearReserva.ejecutar({
      ...datosValidos,
      fecha: ''
    })).rejects.toThrow('La fecha de la reserva es obligatoria');
  });

  it('debe lanzar error si la hora de inicio esta vacia', async () => {
    await expect(crearReserva.ejecutar({
      ...datosValidos,
      hora_inicio: ''
    })).rejects.toThrow('La hora de inicio de la reserva es obligatoria');
  });

  it('debe lanzar error si el numero de comensales es 0', async () => {
    await expect(crearReserva.ejecutar({
      ...datosValidos,
      numero_comensales: 0
    })).rejects.toThrow('Se debe tener al menos 1 comensal para reservar');
  });

  it('debe lanzar error si la mesa no existe', async () => {
    mockMesaRepo.obtenerPorId.mockResolvedValue(null);

    await expect(crearReserva.ejecutar(datosValidos))
      .rejects.toThrow('La mesa no existe');
  });

  it('debe lanzar error si la mesa no tiene capacidad suficiente', async () => {
    mockMesaRepo.obtenerPorId.mockResolvedValue({
      ...mesaMock,
      capacidad: 1
    });

    await expect(crearReserva.ejecutar({
      ...datosValidos,
      numero_comensales: 5
    })).rejects.toThrow('La mesa solo tiene capacidad para');
  });

  it('debe lanzar error si la mesa no esta disponible', async () => {
    mockMesaRepo.obtenerPorId.mockResolvedValue(mesaMock);
    mockReservaRepo.verificarDisponible.mockResolvedValue(false);

    await expect(crearReserva.ejecutar(datosValidos))
      .rejects.toThrow('La mesa no esta disponible en dicho horario');
  });

  it('debe crear la reserva correctamente', async () => {
    mockMesaRepo.obtenerPorId.mockResolvedValue(mesaMock);
    mockReservaRepo.verificarDisponible.mockResolvedValue(true);
    mockReservaRepo.crear.mockResolvedValue(reservaMock);

    const resultado = await crearReserva.ejecutar(datosValidos);

    expect(resultado.usuario_id).toBe(1);
    expect(resultado.mesa_id).toBe(1);
    expect(resultado.estado).toBe(EstadoReserva.Pendiente);
    expect(mockReservaRepo.crear).toHaveBeenCalledTimes(1);
  });
});