const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { createUserSchema, updateUserSchema } = require('../validators/controllers/user');
const validateRequest = require('../validators/middleware');

// Criar um novo usuário
exports.createUser = [
  validateRequest(createUserSchema),
  async (req, res) => {
    try {
      const { password } = req.body;

      // Criptografa a senha antes de salvar no banco de dados
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ ...req.body, password: hashedPassword });
      await user.save();

      res.status(201).json({message: 'Usuário Criado com sucesso.'});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

// Listar todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email'); // apenas name e emai na resposta
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o usuário existe
    const user = await User.findById(id).select('name email'); // apenas name e emai na resposta
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um usuário por ID
exports.updateUser = [
  validateRequest(updateUserSchema),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verifica se o usuário existe
      const user = await User.findById(id).select('name email');
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Atualiza os dados do usuário
      Object.assign(user, req.body);

      // Se uma nova senha for fornecida, criptografa-a
      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

// Excluir um usuário por ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o usuário existe
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};