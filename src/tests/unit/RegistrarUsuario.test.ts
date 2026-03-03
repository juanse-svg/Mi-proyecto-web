// src/tests/unit/RegistrarUsuario.test.ts
import { RegistrarUsuario } from '../../aplicacion/auth/RegistrarUsuario';

import { InterfazUsuario } from '../../dominio/Puertos/InterfazUsuario';
import { Usuario } from '../../dominio/entidades/Usuario';
import RolUsuario from '../../dominio/Enum/RolUsuario';

const mockRepo: jest.Mocked<InterfazUsuario> = {
  crear: jest.fn(),
  obtenerPorEmail: jest.fn(),
  obtenerPorId: jest.fn(),
  actualizar: jest.fn()
};

describe('RegistrarUsuario', () => {
  let registrarUsuario: RegistrarUsuario;

  beforeEach(() => {
    jest.clearAllMocks();
    registrarUsuario = new RegistrarUsuario(mockRepo);
  });

  it('debe lanzar error si el nombre esta vacio', async () => {
    await expect(registrarUsuario.ejecutar({
      nombre: '',
      email: 'test@test.com',
      contraseña: '12345678',
      telefono: 123456789
    })).rejects.toThrow('Un nombre es obligatorio');
  });

  it('debe lanzar error si el email no es valido', async () => {
    await expect(registrarUsuario.ejecutar({
      nombre: 'Juan',
      email: 'emailinvalido',
      contraseña: '12345678',
      telefono: 123456789
    })).rejects.toThrow('Email no es valido');
  });

  it('debe lanzar error si la contraseña tiene menos de 8 caracteres', async () => {
    await expect(registrarUsuario.ejecutar({
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: '123',
      telefono: 123456789
    })).rejects.toThrow('La contraseña debe de tener minimo 8 caracteres');
  });

  it('debe lanzar error si el email ya esta registrado', async () => {
    mockRepo.obtenerPorEmail.mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: 'hash',
      rol: RolUsuario.Cliente,
      telefono: 123456789,
      creada_a_las: ''
    } as Usuario);

    await expect(registrarUsuario.ejecutar({
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: '12345678',
      telefono: 123456789
    })).rejects.toThrow('Ya existe un usuario registrado con este email');
  });

  it('debe registrar el usuario correctamente y no retornar la contraseña', async () => {
    mockRepo.obtenerPorEmail.mockResolvedValue(null);
    mockRepo.crear.mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: 'hashseguro',
      rol: RolUsuario.Cliente,
      telefono: 123456789,
      creada_a_las: ''
    } as Usuario);

    const resultado = await registrarUsuario.ejecutar({
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: '12345678',
      telefono: 123456789
    });

    expect(resultado.email).toBe('juan@test.com');
    expect((resultado as any).contraseña).toBeUndefined();
  });
});