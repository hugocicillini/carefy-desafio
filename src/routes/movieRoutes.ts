import express from 'express';
import {
  addMovie,
  getMovies,
  getMovieById,
  updateMovieState,
  rateMovie,
  getMovieHistory,
} from '../controllers/movieController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { logRequest } from '../middlewares/logMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Operações relacionadas aos filmes na lista de desejos
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Adiciona um filme à lista de desejos
 *     tags: [Movies]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nome do filme
 *     responses:
 *       201:
 *         description: Filme adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, logRequest, addMovie);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Lista os filmes com paginação, ordenação e filtros
 *     tags: [Movies]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Número da página (padrão = 1)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Quantidade de filmes por página (padrão = 10)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Campo para ordenação (padrão = createdAt)
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Ordem da ordenação (ascendente = asc, descendente = desc)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: state
 *         in: query
 *         description: Filtrar por estado do filme
 *         required: false
 *         schema:
 *           type: string
 *       - name: rating
 *         in: query
 *         description: Filtrar por nota do filme
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/', authMiddleware, logRequest, getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Obtém detalhes de um filme específico
 *     tags: [Movies]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Detalhes do filme
 *       404:
 *         description: Filme não encontrado
 */
router.get('/:id', authMiddleware, logRequest, getMovieById);

/**
 * @swagger
 * /movies/{id}/state:
 *   patch:
 *     summary: Atualiza o estado de um filme
 *     tags: [Movies]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 description: >
 *                   Novo estado do filme.
 *                   Exemplo: "A assistir", "Assistido", "Avaliado", "Recomendado", "Não recomendado".
 *     responses:
 *       200:
 *         description: Estado do filme atualizado
 *       400:
 *         description: Dados inválidos
 */
router.patch('/:id/state', authMiddleware, logRequest, updateMovieState);

/**
 * @swagger
 * /movies/{id}/rating:
 *   patch:
 *     summary: Avalia um filme na lista de desejos
 *     tags: [Movies]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Nota do filme (1 a 5)
 *     responses:
 *       200:
 *         description: Avaliação registrada
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.patch('/:id/rating', authMiddleware, logRequest, rateMovie);

/**
 * @swagger
 * /movies/{id}/history:
 *   get:
 *     summary: Obtém o histórico de ações de um filme
 *     tags: [Movies]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Histórico do filme retornado
 *       404:
 *         description: Filme não encontrado
 */
router.get('/:id/history', authMiddleware, logRequest, getMovieHistory);

export default router;
