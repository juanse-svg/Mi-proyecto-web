// src/tests/unit/LoginUsuario.test.ts
import { LoginUsuario } from '../../aplicacion/auth/LoginUsuario';
import RolUsuario from '../../dominio/Enum/RolUsuario';
import { InterfazUsuario } from '../../dominio/Puertos/InterfazUsuario';
import { Usuario } from '../../dominio/entidades/Usuario';
import bcrypt from 'bcrypt';

const mockRepo: jest.Mocked<InterfazUsuario> = {
  crear: jest.fn(),
  obtenerPorEmail: jest.fn(),
  obtenerPorId: jest.fn(),
  actualizar: jest.fn()
};

describe('LoginUsuario', () => {
  let loginUsuario: LoginUsuario;

  beforeEach(() => {
    jest.clearAllMocks();
    loginUsuario = new LoginUsuario(mockRepo);
  });

  it('debe lanzar error si el email no es valido', async () => {
    await expect(loginUsuario.ejecutar({
      email: 'emailsinasterico',
      contraseña: '12345678'
    })).rejects.toThrow('Email no es valido');
  });

  it('debe lanzar error si la contraseña esta vacia', async () => {
    await expect(loginUsuario.ejecutar({
      email: 'test@test.com',
      contraseña: '   '
    })).rejects.toThrow('La contraseña es obligatoria');
  });

  it('debe lanzar error si el usuario no existe', async () => {
    mockRepo.obtenerPorEmail.mockResolvedValue(null);

    await expect(loginUsuario.ejecutar({
      email: 'noexiste@test.com',
      contraseña: '12345678'
    })).rejects.toThrow('Credenciales incorrectas');
  });

  it('debe lanzar error si la contraseña es incorrecta', async () => {
    const hash = await bcrypt.hash('contraseñacorrecta', 10);
    mockRepo.obtenerPorEmail.mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: hash,
      rol: RolUsuario.Cliente,
      telefono: 123456789,
      creada_a_las: ''
    } as Usuario);

    await expect(loginUsuario.ejecutar({
      email: 'juan@test.com',
      contraseña: 'contraseñaincorrecta'
    })).rejects.toThrow('Credenciales incorrectas');
  });

  it('debe retornar token y usuario si las credenciales son correctas', async () => {
    const hash = await bcrypt.hash('12345678', 10);
    mockRepo.obtenerPorEmail.mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      email: 'juan@test.com',
      contraseña: hash,
      rol: RolUsuario.Cliente,
      telefono: 123456789,
      creada_a_las: ''
    } as Usuario);

    const resultado = await loginUsuario.ejecutar({
      email: 'juan@test.com',
      contraseña: '12345678'
    });

    expect(resultado.token).toBeDefined();
    expect(resultado.usuario.email).toBe('juan@test.com');
    expect(resultado.usuario.id).toBe(1);
  });
});