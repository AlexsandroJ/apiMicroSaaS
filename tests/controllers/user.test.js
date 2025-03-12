const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Testes das Rotas de Usuário', () => {
  let userId;
  let token;

  // Insere um usuário no banco de dados antes de cada teste
  beforeEach(async () => {
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword
    });

    // Gera um token JWT para o usuário
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    userId = user._id;
  });

  // Teste: Criar um usuário com dados válidos
  it('Deve criar um novo usuário com dados válidos', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    //expect(response.body.name).toBe('Jane Doe');
  });

  // Teste: Atualizar um usuário por ID (com autenticação)
  it('Deve atualizar um usuário por ID com autenticação', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`) // Adiciona o token JWT ao cabeçalho
      .send({ name: 'John Updated' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Updated');
  });

  // Teste: Atualizar um usuário sem autenticação
  it('Deve retornar erro 401 ao tentar atualizar um usuário sem autenticação', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'John Updated' }); // Sem token JWT

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Acesso negado. Token não fornecido.');
  });

  // Teste: Excluir um usuário por ID (com autenticação)
  it('Deve excluir um usuário por ID com autenticação', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`); // Adiciona o token JWT ao cabeçalho

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Usuário excluído com sucesso.');

    const deletedUser = await User.findById(userId);
    expect(deletedUser).toBeNull();
  });

  // Teste: Excluir um usuário sem autenticação
  it('Deve retornar erro 401 ao tentar excluir um usuário sem autenticação', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`); // Sem token JWT

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Acesso negado. Token não fornecido.');
  });
});