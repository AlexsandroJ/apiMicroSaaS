const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Testes das Rotas de Sessão', () => {
  let user;
  let token;

  // Insere um usuário no banco de dados antes de cada teste
  beforeEach(async () => {
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword
    });
    //console.log("password: ",user.password);
  });

  // Teste: Login com credenciais válidas
  it('Deve fazer login com credenciais válidas e retornar um token JWT', async () => {
    const response = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'john@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token; // Salva o token para uso posterior
  });

  // Teste: Login com credenciais inválidas (senha incorreta)
  it('Deve retornar erro 401 para credenciais inválidas (senha incorreta)', async () => {
    const response = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'john@example.com',
        password: 'senhaerrada'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Credenciais inválidas.');
  });

  // Teste: Login com email inexistente
  it('Deve retornar erro 401 para email inexistente', async () => {
    const response = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'inexistente@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Credenciais inválidas.');
  });

  // Teste: Logout com token válido
  it('Deve encerrar a sessão com sucesso ao fazer logout', async () => {
    // Faz login primeiro para obter o token
    const loginResponse = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'john@example.com',
        password: 'password123'
      });

    token = loginResponse.body.token;

    // Faz logout
    const response = await request(app)
      .post('/api/sessions/logout')
      .set('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho
      .send({ token });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout realizado com sucesso.');
  });

  // Teste: Logout com token inválido
  it('Deve retornar erro 500 para logout com token inválido', async () => {
    const response = await request(app)
      .post('/api/sessions/logout')
      .set('Authorization', `Bearer ${'tokeninvalido'}`) // Adiciona o token no cabeçalho
      .send({ token: 'tokeninvalido' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  // Teste: Token expirado
  it('Deve retornar erro 403 para token expirado', async () => {
    // Cria um token expirado manualmente
    const expiredToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '-1h' });

    // Tenta acessar uma rota protegida com o token expirado
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({ name: 'Updated Name' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Token inválido ou expirado.');
  });
});