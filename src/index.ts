import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import movieRoutes from './routes/movieRoutes';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/movies', movieRoutes);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Filmes - Lista de Desejos',
      version: '1.0.0',
      description: 'API para gerenciar uma lista de desejos de filmes.',
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  (
    error: { status: number; message: string; stack: any },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(error.status || 500).json({
      message: error.message || 'Ocorreu um erro!',
      status: error.status || 500,
      stack: error.stack,
    });
  }
);

app.get('/', (req: Request, res: Response) => {
  res.send('API Carefy Desafio');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
  console.log(`Documentação em http://localhost:${PORT}/api-docs`);
});
