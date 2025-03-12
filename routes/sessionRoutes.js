const express = require('express');
const { login, logout } = require('../controllers/sessionController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Faz login e retorna um token JWT
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/sessions/login', login); // Não usa middleware de autenticação

/**
 * @swagger
 * /api/sessions/logout:
 *   post:
 *     summary: Encerra uma sessão
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post('/sessions/logout', authenticateToken, logout); // Usa middleware de autenticação

module.exports = router;