// src/tests/unit/CancelarReserva.test.ts
import { CancelarReserva } from '../../aplicacion/reservas/CancelarReserva';
import { InterfazReserva } from '../../dominio/Puertos/InterfazReserva';
import { Reserva } from '../../dominio/entidades/Reserva';
import EstadoReserva from '../../dominio/Enum/EstadoReserva';

const mockRepo: jest.Mocked<InterfazReserva> = {
  crear: jest.fn(),
  obtenerPorId: jest.fn(),
  obtenerTodas: jest.fn(),
  actualizar: jest.fn(),
  cancelar: jest.fn(),
  verificarDisponible: jest.fn(),
  obtenerPorUsuario: jest.fn()
};

describe('CancelarReserva', () => {
  let cancelarReserva: CancelarReserva;

  beforeEach(() => {
    jest.clearAllMocks();
    cancelarReserva = new CancelarReserva(mockRepo);
  });

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

  it('debe lanzar error si el id no es valido', async () => {
    await expect(cancelarReserva.ejecutar(0, 1, 'cliente'))
      .rejects.toThrow('El id de la reserva no es valido');
  });

  it('debe lanzar error si la reserva no existe', async () => {
    mockRepo.obtenerPorId.mockResolvedValue(null);

    await expect(cancelarReserva.ejecutar(1, 1, 'cliente'))
      .rejects.toThrow('Reserva no encontrada');
  });

  it('debe lanzar error si la reserva ya esta cancelada', async () => {
    mockRepo.obtenerPorId.mockResolvedValue({
      ...reservaMock,
      estado: EstadoReserva.Cancelada
    });

    await expect(cancelarReserva.ejecutar(1, 1, 'cliente'))
      .rejects.toThrow('La reserva ya fue cancelada');
  });

  it('debe lanzar error si la reserva ya esta completada', async () => {
    mockRepo.obtenerPorId.mockResolvedValue({
      ...reservaMock,
      estado: EstadoReserva.Completada
    });

    await expect(cancelarReserva.ejecutar(1, 1, 'cliente'))
      .rejects.toThrow('No se puede cancelar una reserva ya completada');
  });

  it('debe lanzar error si un cliente intenta cancelar una reserva que no es suya', async () => {
    mockRepo.obtenerPorId.mockResolvedValue({
      ...reservaMock,
      usuario_id: 99
    });

    await expect(cancelarReserva.ejecutar(1, 1, 'Cliente'))
      .rejects.toThrow('No tienes permiso para cancelar esta reserva');
  });

  it('debe cancelar correctamente si el rol es gerente', async () => {
    mockRepo.obtenerPorId.mockResolvedValue(reservaMock);
    mockRepo.cancelar.mockResolvedValue(true);

    const resultado = await cancelarReserva.ejecutar(1, 99, 'gerente');

    expect(resultado.mensaje).toBe('Su reserva fue cancelada correctamente');
    expect(mockRepo.cancelar).toHaveBeenCalledWith(1);
  });

  it('debe cancelar correctamente si el cliente es dueño de la reserva con mas de 24 horas', async () => {
    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 3);
    const fecha = fechaFutura.toISOString().split('T')[0];

    mockRepo.obtenerPorId.mockResolvedValue({
      ...reservaMock,
      usuario_id: 1,
      fecha,
      hora_inicio: '13:00'
    });
    mockRepo.cancelar.mockResolvedValue(true);

    const resultado = await cancelarReserva.ejecutar(1, 1, 'Cliente');
    expect(resultado.mensaje).toBe('Su reserva fue cancelada correctamente');
  });
});